import {
    STORES,
    STORES_REQUESTED,
    STORES_ERROR,
    STORES_INVALIDATE,
    STORE_AUTH,
    STORE_DETAILS,
    STORE_CREATED,
    STORE_CREATE_ERRORS
} from "../api/strings";

const storesReducerDefaultState = {
    stores: [],
    storeDetails: {},
    storesRequested: false,
    storesError: false,
    storeAuth: false,
    storeCreated: null,
    storeCreateErrors: []
};

export default (state = storesReducerDefaultState, action) => {
    switch (action.type) {
        case STORES:
            return {
                ...state,
                stores: action.stores,
                storesRequested: false,
                storesError: false
            };
        case STORES_REQUESTED:
            return {
                ...state,
                ...storesReducerDefaultState,
                storesRequested: true
            };
        case STORES_ERROR:
            return {
                ...state,
                ...storesReducerDefaultState,
                storesError: true
            };
        case STORES_INVALIDATE:
            return {
                ...state,
                ...storesReducerDefaultState
            };
        case STORE_AUTH:
            return {
                ...state,
                storeAuth: action.storeAuth
            };
        case STORE_DETAILS:
            return {
                ...state,
                storeDetails: action.storeDetails,
                storesRequested: false,
                storesError: false
            };
        case STORE_CREATED:
            return {
                ...state,
                storeCreated: action.storeId,
                storesRequested: false,
                storeCreateErrors: []
            };
        case STORE_CREATE_ERRORS:
            return {
                ...state,
                storesRequested: false,
                storeCreated: null,
                storeCreateErrors: action.storeCreateErrors
            };
        default:
            return state;
    }
};
