<?php

namespace App\Http\Controllers;

use Auth;
use Cache;
use App\Http\Requests\AddressRequest;
use App\Http\Requests\CartRequest;
use App\Http\Requests\CartUpdateRequest;
use App\Models\Address;
use App\Models\Country;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Rules\AddressRule;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * The cart entity is stored purely in the Redis cache, and has no model or DB
 * representation. Each user's cart is keyed to a UID generated on the client,
 * stored in the client's local storage. The server-side cart has a 60-minute
 * cache duration, refreshed each time the cart is requested from the back-end,
 * or posted to. Upon checkout, the cart is emptied.
 */
class CartController extends Controller
{
    const CACHE_TAG = 'carts';

    const CACHE_DURATION_MINUTES = 60;

    /**
     * Primary get interface for the user's shopping cart. Note that the cache
     * expiration is refreshed upon each get.
     *
     * @param  string $cart_uid A client-side generated UUID identifying the
     * device.
     * @return array            An array of cart items.
     */
    private function getCart($cart_uid)
    {
        $cart = [];

        if (Cache::tags(self::CACHE_TAG)->has($cart_uid)) {
            $cart = Cache::tags(self::CACHE_TAG)->get($cart_uid);
        }

        // Refresh the expiration upon fetch.
        return self::setCart($cart_uid, $cart);
    }

    /**
     * Primary set interface for the user's shopping cart.
     *
     * @param  string $cart_uid A client-side generated UUID identifying the
     * device.
     * @return array            An array of cart items.
     */
    private function setCart($cart_uid, $cart)
    {
        // Ensure it converts to a JSON array, not object.
        $cart = array_values($cart);

        Cache::tags(self::CACHE_TAG)->put($cart_uid, $cart, self::CACHE_DURATION_MINUTES);

        return $cart;
    }

    public function index($cart_uid)
    {
        return response()->json(self::getCart($cart_uid));
    }

    public function store(CartRequest $request, $cart_uid)
    {
        $cart = self::getCart($cart_uid);
        $new_item = $request->validated();
        $item_present = false;

        // If item is already in cart, update it.
        foreach ($cart as $i => $item) {
            if ($item['product_id'] === $new_item['product_id']) {
                $cart[$i] = $new_item;
                $item_present = true;
            }
        }

        // Else append it.
        if (! $item_present) {
            $cart[] = $new_item;
        }

        return response()->json(self::setCart($cart_uid, $cart));
    }

    public function update(CartUpdateRequest $request, $cart_uid, $product_id)
    {
        $cart = self::getCart($cart_uid);
        $update = $request->validated();

        // If item is already in cart, update it.
        foreach ($cart as $i => $item) {
            if ($item['product_id'] == $product_id) {
                $cart[$i] = array_merge($item, $update);
            }
        }

        return response()->json(self::setCart($cart_uid, $cart));
    }

    public function destroy($cart_uid, $product_id)
    {
        if ((integer) $product_id != $product_id) {
            abort(401, 'A product ID must be provided.');
        }

        $cart = self::getCart($cart_uid);

        // If item is already in cart, remove it.
        foreach ($cart as $i => $item) {
            if ($item['product_id'] == $product_id) {
                unset($cart[$i]);
            }
        }

        return response()->json(self::setCart($cart_uid, $cart));
    }

    /**
     * Return the cart subtotal, taxes and shipping cost, and update the prices
     * on all cart items.
     *
     * @param  string $cart_uid The cart ID
     * @return object           The cart plus totals.
     */
    public function showCartTotals($cart_uid)
    {
        return response()->json(self::getCartTotals($cart_uid));
    }

    /**
     * Handling Order creation in the Cart controller since we need access to the
     * cart.
     *
     * @param  OrderRequest $request Validated order request.
     * @return Order                 Newly created Order entity.
     */
    public function storeOrder(AddressRequest $request, $cart_uid)
    {
        if (! Auth::check()) {
            abort(403, 'Unauthorized action.');
        }

        $user = Auth::user();

        $address_id = self::addressIdFirstOrCreate($request, $user);

        $cart_totals = self::getCartTotals($cart_uid);

        $order = Order::create([
            'user_id' => $user->id,
            'address_id' => $address_id,
            'subtotal' => $cart_totals['subtotal'],
            'shipping' => $cart_totals['shipping'],
            'taxes' => $cart_totals['taxes'],
            'total' => $cart_totals['total'],
            'currency_id' => 1,// Currently only support USD orders.
        ]);

        // Empty the cart cache upon order.
        self::setCart($cart_uid, []);

        foreach ($cart_totals['cart'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'price' => $item['price'],
                'currency_id' => $item['currency_id'],
                'quantity' => $item['quantity'],
            ]);
        }

        return response()->json($order);
    }

    // Check if address exists, else make one, and return its ID.
    private function addressIdFirstOrCreate(AddressRequest $request, User $user)
    {
        // Validate the address as separate fields, then as an imploded string.
        $address_input = $request->validated();
        $address_string = self::addressArrayToString($address_input);
        $address_lookup = '';
        $address_id = null;


        // If we were given an address ID, look it up and convert it to an
        // address string.
        if (isset($address_input['id'])) {
            $address_lookup = self::addressArrayToString(
                Address::find($address_input['id'])->first()->toArray()
            );
        }

        // If we already have the specified address unmodified, use it; else,
        // create a new Address entry for the user.
        if ($address_lookup && $address_string === $address_lookup) {
            $address_id = $address_input['id'];
        } else {
            // Run a second validation with a map service API lookup.
            $request->validate([ $address_string ], [ new AddressRule ]);

            // Generate a name for the address entry if none provided.
            if (! isset($address_input['name'])) {
                $address_input['name'] = 'Latest order address';
            }

            $address_id = Address::create($address_input)->id;

            $user->addresses()->attach($address_id);
        }

        return $address_id;
    }

    private function addressArrayToString(array $address_array): string
    {
        return implode(' ', [
            $address_array['street_1'],
            $address_array['street_2'],
            $address_array['city'],
            $address_array['state'],
            $address_array['postal_code'],
            Country::find($address_array['country_id'])->first()->abbreviation,
        ]);
    }

    private function getCartTotals($cart_uid)
    {
        $subtotal = 0;
        $shipping = 10;// Mock a flat $10 shipping rate.
        $taxes = 0;
        $tax_rate = 0.1;// Mock a flat 10% sales tax
        $total = 0;
        $billing_currency_id = 1;// Pretend sales are in USD
        $currency_exchanges = self::getCurrencyExchangeRates();

        $cart = self::getCart($cart_uid);

        $product_ids = array_pluck($cart, 'product_id');

        $products = Product::whereIn('id', $product_ids);

        if (count($cart) !== $products->count()) {
            abort(500, 'There appears to be an invalid item in your cart. Not sure how that happened.');
        }

        $products = $products->get();

        foreach ($products as $i => $product) {
            $currency = 'USD';
            $exchange = 1;

            if ($product->currency_id !== $billing_currency_id) {
                $currency = $product->currency()->first()->abbreviation;

                if (! isset($currency_exchanges[$currency])) {
                    abort(500, 'We were unable to convert the currency for the item: ' . $product->name);
                }

                $exchange = $currency_exchanges[$currency];
            }

            $subtotal = number_format(
                $subtotal + (
                    $product->price * (integer) $cart[$i]['quantity'] * $exchange
                ),
                2,
                '.',
                ''
            );

            // Update cart product info while we've got it.
            $cart[$i]['name'] = $product->name;
            $cart[$i]['price'] = $product->price;
            $cart[$i]['currency'] = $currency;
            $cart[$i]['currency_id'] = $product->currency_id;
        }

        $taxes = number_format($subtotal * $tax_rate, 2, '.', '');

        $total = $subtotal + $taxes + $shipping;

        // Store updated cart product info.
        return [
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'taxes' => $taxes,
            'total' => $total,
            'cart' => self::setCart($cart_uid, $cart)
        ];
    }

    private function getCurrencyExchangeRates()
    {
        // Mocking with static values; replace with API for actual use.
        // base: USD
        return [
            "AED" => 3.673197,
            "AFN" => 73.760128,
            "ALL" => 109.329847,
            "AMD" => 483.730252,
            "ANG" => 1.84595,
            "AOA" => 278.809034,
            "ARS" => 38.963499,
            "AUD" => 1.39275,
            "AWG" => 1.7925,
            "AZN" => 1.702503,
            "BAM" => 1.594098,
            "BBD" => 2.00265,
            "BDT" => 83.941994,
            "BGN" => 1.689202,
            "BHD" => 0.37713,
            "BIF" => 1771.45,
            "BMD" => 1,
            "BND" => 1.510945,
            "BOB" => 6.91355,
            "BRL" => 4.154897,
            "BSD" => 1.00045,
            "BTC" => 0.000136,
            "BTN" => 71.479721,
            "BWP" => 10.957499,
            "BYN" => 2.10725,
            "BYR" => 19600,
            "BZD" => 2.010979,
            "CAD" => 1.317665,
            "CDF" => 1615.999947,
            "CHF" => 0.974545,
            "CLF" => 0.0226,
            "CLP" => 692.201482,
            "CNY" => 6.8444,
            "COP" => 3089.55,
            "CRC" => 577.264995,
            "CUC" => 1,
            "CUP" => 26.5,
            "CVE" => 95.430498,
            "CZK" => 22.230098,
            "DJF" => 177.720195,
            "DKK" => 6.4382,
            "DOP" => 50.035006,
            "DZD" => 118.254971,
            "EGP" => 17.909504,
            "ERN" => 15.000034,
            "ETB" => 27.65697,
            "EUR" => 0.863665,
            "FJD" => 2.12675,
            "FKP" => 0.780089,
            "GBP" => 0.77775,
            "GEL" => 2.490086,
            "GGP" => 0.777762,
            "GHS" => 4.791101,
            "GIP" => 0.779681,
            "GMD" => 48.034992,
            "GNF" => 9050.297171,
            "GTQ" => 7.59375,
            "GYD" => 209.325025,
            "HKD" => 7.84915,
            "HNL" => 24.068016,
            "HRK" => 6.416697,
            "HTG" => 69.106503,
            "HUF" => 283.201928,
            "IDR" => 14989.45,
            "ILS" => 3.616815,
            "IMP" => 0.777762,
            "INR" => 71.385009,
            "IQD" => 1193.85,
            "IRR" => 42104.999828,
            "ISK" => 109.520289,
            "JEP" => 0.777762,
            "JMD" => 137.603045,
            "JOD" => 0.709503,
            "JPY" => 111.469008,
            "KES" => 100.739887,
            "KGS" => 68.778035,
            "KHR" => 4090.950429,
            "KMF" => 426.089577,
            "KPW" => 900.014232,
            "KRW" => 1118.570055,
            "KWD" => 0.302895,
            "KYD" => 0.83374,
            "KZT" => 368.78981,
            "LAK" => 8524.749624,
            "LBP" => 1513.649996,
            "LKR" => 161.889969,
            "LRD" => 154.249913,
            "LSL" => 14.244994,
            "LTL" => 3.048704,
            "LVL" => 0.62055,
            "LYD" => 1.38225,
            "MAD" => 9.443007,
            "MDL" => 16.708502,
            "MGA" => 3374.149914,
            "MKD" => 53.18032,
            "MMK" => 1541.750219,
            "MNT" => 2479.916455,
            "MOP" => 8.088702,
            "MRO" => 357.431127,
            "MUR" => 34.470159,
            "MVR" => 15.460222,
            "MWK" => 727.310259,
            "MXN" => 19.36937,
            "MYR" => 4.140973,
            "MZN" => 60.004986,
            "NAD" => 14.414973,
            "NGN" => 359.68036,
            "NIO" => 31.951503,
            "NOK" => 8.40289,
            "NPR" => 114.495011,
            "NZD" => 1.525905,
            "OMR" => 0.384975,
            "PAB" => 1.00045,
            "PEN" => 3.31545,
            "PGK" => 3.25215,
            "PHP" => 53.605499,
            "PKR" => 123.195016,
            "PLN" => 3.71955,
            "PYG" => 5829.302537,
            "QAR" => 3.64099,
            "RON" => 3.999898,
            "RSD" => 101.979826,
            "RUB" => 68.102303,
            "RWF" => 881.08,
            "SAR" => 3.750999,
            "SBD" => 7.91755,
            "SCR" => 13.608503,
            "SDG" => 18.0085,
            "SEK" => 9.096797,
            "SGD" => 1.375895,
            "SHP" => 1.320898,
            "SLL" => 8699.999933,
            "SOS" => 577.502122,
            "SRD" => 7.457984,
            "STD" => 21110.175626,
            "SVC" => 8.754697,
            "SYP" => 515.000288,
            "SZL" => 15.212029,
            "THB" => 32.824976,
            "TJS" => 9.426802,
            "TMT" => 3.505,
            "TND" => 2.792895,
            "TOP" => 2.292349,
            "TRY" => 6.6873,
            "TTD" => 6.74355,
            "TWD" => 30.7585,
            "TZS" => 2287.299569,
            "UAH" => 28.421999,
            "UGX" => 3768.850256,
            "USD" => 1,
            "UYU" => 32.230322,
            "UZS" => 7830.901142,
            "VEF" => 248519.95046,
            "VND" => 23324.9,
            "VUV" => 113.697861,
            "WST" => 2.607959,
            "XAF" => 567.679743,
            "XAG" => 0.070729,
            "XAU" => 0.000839,
            "XCD" => 2.70255,
            "XDR" => 0.716418,
            "XOF" => 567.669819,
            "XPF" => 103.21023,
            "YER" => 250.350245,
            "ZAR" => 15.351801,
            "ZMK" => 9001.199662,
            "ZMW" => 10.354977,
            "ZWL" => 322.355011,
        ];
    }
}
