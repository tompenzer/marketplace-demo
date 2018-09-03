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

export const subcategoryProductAPI = (subcategory) => (
    `api/category/${subcategory}`
);

export const loginAPI = "oauth/token";

export const getUserAPI = "/api/user";

export const logoutAPI = "api/logout";

export const registerAPI = "api/register";

export const addToCartAPI = "api/addtocart";

export const removeFromCartAPI = (productID) => (
    `api/removefromcart/${productID}`
);

export const getUserCartAPI = "api/getusercart";

export const addToWishlistAPI = "api/addtowishlist";

export const removeFromWishlistAPI = (productID) => (
    `api/removefromwishlist/${productID}`
);

export const getUserWishlistAPI = "api/getuserwishlist";

export const wishlistToCartAPI = "api/wishlistcart";

export const checkoutinformationAPI = "api/checkoutinformation";

export const placeOrderAPI = "api/placeorder";

export const userordersAPI = "api/userorders";

export const orderDetailAPI = (order_id) => (
    `api/order/${order_id}`
);

export const validatePromoAPI = "api/validatepromo";

export const contactAPI = "/api/contact";

export const productsApi = '/api/products';

export const storesApi = '/api/stores';

export const unitsApi = '/api/units';

export const currenciesApi = '/api/currencies';
