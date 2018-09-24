// Local Storage keys
export const ACCESS_TOKEN = 'access_token_marketplace_demo';

export const REFRESH_TOKEN = 'refresh_token_marketplace_demo';

export const CART_UID = 'cart_uid_marketplace_demo';


// Redux actions
export const LOG_IN = 'LOG_IN';

export const LOG_IN_REQUESTED = 'LOG_IN_REQUESTED';

export const LOG_IN_ERROR = 'LOG_IN_ERROR';

export const LOG_OUT = 'LOG_OUT';

export const USER_CREATED = 'USER_CREATED';

export const USER_CREATE_REQUESTED = 'USER_CREATE_REQUESTED';

export const USER_CREATE_ERRORS = 'USER_CREATE_ERRORS';

export const STORES = 'STORES';

export const STORES_REQUESTED = 'STORES_REQUESTED';

export const STORES_ERROR = 'STORES_ERROR';

export const STORES_INVALIDATE = 'STORES_INVALIDATE';

export const STORE_AUTH = 'STORE_AUTH';

export const STORE_AUTH_REQUESTED = 'STORE_AUTH_REQUESTED';

export const STORE_AUTH_ERROR = 'STORE_AUTH_ERROR';

export const STORE_DETAILS = 'STORE_DETAILS';

export const STORE_DETAILS_INVALIDATE = 'STORE_DETAILS_INVALIDATE';

export const STORE_CREATED = 'STORE_CREATED';

export const STORE_CREATE_ERRORS = 'STORE_CREATE_ERRORS';

export const PRODUCTS = 'PRODUCTS';

export const PRODUCTS_REQUESTED = 'PRODUCTS_REQUESTED';

export const PRODUCTS_ERROR = 'PRODUCTS_ERROR';

export const PRODUCTS_INVALIDATE = 'PRODUCTS_INVALIDATE';

export const PRODUCT_DETAILS = 'PRODUCT_DETAILS';

export const PRODUCT_CREATED = 'PRODUCT_CREATED';

export const PRODUCT_CREATE_ERRORS = 'PRODUCT_CREATE_ERRORS';

export const USER_DETAILS = 'USER_DETAILS';

export const USERS_REQUESTED = 'USERS_REQUESTED';

export const USERS_ERROR = 'USERS_ERROR';

export const ORDER_CREATED = 'ORDER_CREATED';

export const ORDER_REQUESTED = 'ORDER_REQUESTED';

export const ORDER_ERRORS = 'ORDER_ERRORS';

export const ORDER_INFO = 'ORDER_INFO';

export const ORDER_INFO_REQUESTED = 'ORDER_INFO_REQUESTED';

export const ORDER_INFO_ERROR = 'ORDER_INFO_ERROR';

export const USER_ORDERS = 'USER_ORDERS';

export const ORDERS_REQUESTED = 'ORDERS_REQUESTED';

export const ORDERS_ERROR = 'ORDERS_ERROR';

export const COUNTRIES = 'COUNTRIES';

export const COUNTRIES_REQUESTED = 'COUNTRIES_REQUESTED';

export const COUNTRIES_ERROR = 'COUNTRIES_ERROR';

export const COUNTRIES_INVALIDATE = 'COUNTRIES_INVALIDATE';

export const UNITS = 'UNITS';

export const UNITS_REQUESTED = 'UNITS_REQUESTED';

export const UNITS_ERROR = 'UNITS_ERROR';

export const CURRENCIES = 'CURRENCIES';

export const CURRENCIES_REQUESTED = 'CURRENCIES_REQUESTED';

export const CURRENCIES_ERROR = 'CURRENCIES_ERROR';

export const ADD_TO_CART = 'ADD_TO_CART';

export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';

export const CART_REMOVE_REQUESTED = 'CART_REMOVE_REQUESTED';

export const CART_REMOVE_COMPLETED = 'CART_REMOVE_COMPLETED';

export const EDIT_CART = 'EDIT_CART';

export const CART_EDIT_REQUESTED = 'CART_EDIT_REQUESTED';

export const CART_EDIT_COMPLETED = 'CART_EDIT_COMPLETED';

export const CART_EDIT_ERRORS = 'CART_EDIT_ERRORS';

export const EMPTY_CART = 'EMPTY_CART';

export const CART_REQUESTED = 'CART_REQUESTED';

export const CART_ERROR = 'CART_ERROR';

export const CART_TOTALS = 'CART_TOTALS';


// Routes and paths
export const ROUTES = {
    root: '/',
    about: '/about',
    auth: {
        login: '/login',
        register: '/register',
        logout: '/logout'
    },
    products: {
        index: '/products',
        search: '/products/:q',
        show: '/product/:id',
        store: '/store/:storeId/products/add',
        update: '/store/:storeId/product/:productId/edit'
    },
    stores: {
        index: '/stores',
        search: '/stores/:q',
        show: '/store/:storeId',
        store: '/store/add',
        update: '/store/:storeId/edit'
    },
    orders: {
        checkout: '/checkout',
        confirmation: '/order',
        index: '/orders',
        show: '/order/:orderId'
    },
    users: {
        show: '/account'
    }
};

export const NOT_FOUND_IMAGE = '/images/notfound.jpg';

export const REPO_URL = 'https://github.com/tompenzer/marketplace-demo';


// UI strings
export const ADDED_TO_CART_SNACKBAR = 'Added to Cart';

export const SUCCESSFUL_ORDER = 'Successful order';

export const ANY = 'Any';

export const MORE_THAN_FOUR = 'More than 4';

export const MORE_THAN_THREE = 'More than 3';

export const ONE_TO_THREE = '1 to 3';

export const YES = 'Yes';

export const NO = 'No';

export const RATINGS = 'Ratings';

export const PRICE_HIGH_TO_LOW = 'Price: High to Low';

export const PRICE_LOW_TO_HIGH = 'Price: Low to High';

export const NEW = 'New';
