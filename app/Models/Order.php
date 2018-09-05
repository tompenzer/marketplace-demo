<?php

namespace App\Models;

use Auth;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use SoftDeletes;

    /**
     * The table for the model.
     *
     * @var array
     */
    protected $table = 'orders';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'address_id',
        'subtotal',
        'shipping',
        'taxes',
        'total',
        'currency_id',
    ];

    /**
     * Return the user's orders
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class)
            ->with('product');// Always fetch the product with the item info
    }

    /**
     * Return the user's orders
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Return the user's orders
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class, 'address_id');
    }

    /**
     * Scope a query to search orders
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if ($search) {
            return $query->where('id', 'LIKE', "%{$search}%")
                ->orWhereHas('items', function ($query) use ($search) {
                    return $query->where('product_id', 'LIKE', "%{$search}%")
                        ->orWhereHas('product', function ($query) use ($search) {
                            return $query->where('name', 'LIKE', "%{$search}%")
                                ->orWhere('description', 'LIKE', "%{$search}%");
                        });
                });
        }

        return $query;
    }

    /**
    * Scope a query by user.
    *
    * @param integer $user_id The user to which you would like to scope.
    */
    public function scopeUserIs(Builder $query, int $user_id): Builder
    {
        return $query->where('user_id', $user_id);
    }

    /**
     * Whether the authenticated user has authorization to access the order.
     */
    public function userHasAuth(): bool
    {
        return Auth::check() && (
            Auth::user()->isSiteAdmin()
            || $this->user()->first()->id === Auth::user()->id
        );
    }
}
