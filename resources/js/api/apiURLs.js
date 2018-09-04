export const modelAPI = (model) => (
    `/api/${model}`
);

export const searchProductsAPI = (category, query) => (
    `/api/search/${category}/${query}`
);

export const productInfoAPI = (productId) => (
    `/api/products/${productId}`
);

export const productUpdateApi = (productId) => (
    `/api/products/${productId}/update`
);

export const storeInfoApi = (storeId) => (
    `/api/stores/${storeId}`
);

export const storeUpdateApi = (storeId) => (
    `/api/stores/${storeId}/update`
);

export const storeAuthApi = (storeId) => (
    `/api/stores/${storeId}/auth`
);

export const userCartApi = (cartUid) => (
    `/api/cart/${cartUid}`
);

export const addToCartApi = (cartUid) => (
    `/api/cart/${cartUid}`
);

export const removeFromCartApi = (cartUid, productId) => (
    `/api/cart/${cartUid}/item/${productId}`
);

export const userAddressApi = (userId) => (
    `/api/user/${userId}/addresses`
);

export const userAddressInfoApi = (userId, addressId) => (
    `/api/user/${userId}/address/${addressId}`
);

export const userAddressUpdateApi = (userId, addressId) => (
    `/api/user/${userId}/address/${addressId}/update`
);

export const userAddressRemoveApi = (userId, addressId) => (
    `/api/user/${userId}/address/${addressId}/delete`
);

export const loginAPI = "/oauth/token";

export const getUserAPI = "/api/user";

export const logoutAPI = "/api/logout";

export const registerAPI = "/api/register";

export const addToWishlistAPI = "/api/addtowishlist";

export const removeFromWishlistAPI = (productID) => (
    `/api/removefromwishlist/${productID}`
);

export const getUserWishlistAPI = "/api/getuserwishlist";

export const wishlistToCartAPI = "/api/wishlistcart";

export const checkoutinformationAPI = "/api/checkoutinformation";

export const placeOrderAPI = "/api/placeorder";

export const userordersAPI = "/api/userorders";

export const orderDetailAPI = (order_id) => (
    `/api/order/${order_id}`
);

export const contactAPI = "/api/contact";

export const productsApi = '/api/products';

export const storesApi = '/api/stores';

export const unitsApi = '/api/units';

export const currenciesApi = '/api/currencies';
