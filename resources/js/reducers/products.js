import {
    PRODUCTS,
    PRODUCTS_REQUESTED,
    PRODUCTS_ERROR,
    PRODUCTS_INVALIDATE,
    PRODUCT_DETAILS,
    PRODUCT_CREATED,
    PRODUCT_CREATE_ERRORS
} from "../api/strings";

const productsReducerDefaultState = {
    products: [],
    productDetails: {},
    productsRequested: false,
    productsError: false,
    productCreated: null,
    productCreateErrors: []
};

export default (state = productsReducerDefaultState, action) => {
    switch (action.type) {
        case PRODUCTS:
            return {
                ...state,
                products: action.products,
                productsRequested: false,
                productsError: false
            };
        case PRODUCTS_REQUESTED:
            return {
                ...state,
                ...productsReducerDefaultState,
                productsRequested: true
            };
        case PRODUCTS_ERROR:
            return {
                ...state,
                ...productsReducerDefaultState,
                productsError: true
            };
        case PRODUCTS_INVALIDATE:
            return {
                ...state,
                ...productsReducerDefaultState
            };
        case PRODUCT_DETAILS:
             return {
                ...state,
                productDetails: action.productDetails,
                productsRequested: false,
                productsError: false
            };
        case PRODUCT_CREATED:
            return {
                ...state,
                productCreated: action.productId,
                productsRequested: false,
                productCreateErrors: []
            };
        case PRODUCT_CREATE_ERRORS:
            return {
                ...state,
                productsRequested: false,
                productCreated: null,
                productCreateErrors: action.productCreateErrors
            };
        default:
            return state;
    }
};
