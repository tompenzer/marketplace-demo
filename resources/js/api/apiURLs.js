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

export const editCartApi = (cartUid, productId) => (
    `/api/cart/${cartUid}/item/${productId}`
);

export const removeFromCartApi = (cartUid, productId) => (
    `/api/cart/${cartUid}/item/${productId}`
);

export const userCartTotalsApi = (cartUid) => (
    `/api/cart/${cartUid}/totals`
);

export const userOrderApi = (cartUid) => (
    `/api/order/${cartUid}`
);

export const userOrderInfoApi = (orderId) => (
    `/api/order/${orderId}`
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

export const userOrdersApi = "/api/orders";

export const contactAPI = "/api/contact";

export const productsApi = '/api/products';

export const storesApi = '/api/stores';

export const unitsApi = '/api/units';

export const currenciesApi = '/api/currencies';

export const countriesApi = '/api/countries';
