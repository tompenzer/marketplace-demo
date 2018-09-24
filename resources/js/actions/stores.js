import axios, { getAuthHeaders } from "../api/axiosInstance";
import {
    STORES,
    STORES_REQUESTED,
    STORES_ERROR,
    STORES_INVALIDATE,
    STORE_AUTH,
    STORE_AUTH_REQUESTED,
    STORE_AUTH_ERROR,
    STORE_DETAILS,
    STORE_CREATED,
    STORE_CREATE_ERRORS
} from "../api/strings";
import {
    storesApi,
    storeAuthApi,
    storeInfoApi,
    storeUpdateApi
} from "../api/apiURLs";

export const addStoresHelper = (stores = []) => ({
    type: STORES,
    stores: stores
});

export const storesRequested = () => ({
    type: STORES_REQUESTED
});

export const storesError = () => ({
    type: STORES_ERROR
});

export const invalidateStores = () => ({
    type: STORES_INVALIDATE
});

export const checkStoreAuthHelper = (authorization = false) => ({
    type: STORE_AUTH,
    storeAuth: authorization
});

export const storeAuthRequested = () => ({
    type: STORE_AUTH_REQUESTED
});

export const storeAuthError = () => ({
    type: STORE_AUTH_ERROR
});

export const addStoreDetailsHelper = (storeDetails = {}) => ({
    type: STORE_DETAILS,
    storeDetails: storeDetails
});

export const addStoreHelper = (storeId = null) => ({
    type: STORE_CREATED,
    storeId: storeId
});

export const addStoreErrors = (errors = []) => ({
    type: STORE_CREATE_ERRORS,
    storeCreateErrors: errors
});

export const loadStores = (query = '') => {
    return (dispatch, getState) => {
        dispatch(storesRequested());

        let options = {};

        if (query) {
            options.params = { q: query };
        }

        axios.get(storesApi, options)
            .then(response => dispatch(addStoresHelper(response.data.data)))
            .catch(error => dispatch(storesError()));
    }
};

// Check if logged in user has authorization to edit store.
export const checkStoreAuth = (storeId) => {
    return (dispatch, getState) => {
        dispatch(storeAuthRequested);

        axios.get(storeAuthApi(storeId), getAuthHeaders())
            .then(response => dispatch(checkStoreAuthHelper(response.data)))
            .catch(error => dispatch(storeAuthError()));
    }
};

export const loadStoreDetails = (storeId) => {
    return (dispatch, getState) => {
        dispatch(storesRequested());

        // Get the store info
        axios.get(storeInfoApi(storeId))
            .then(response => dispatch(addStoreDetailsHelper(response.data)))
            .catch(error => dispatch(storesError()));
    }
};

export const saveStore = (store) => {
    return (dispatch, getState) => {
        dispatch(storesRequested());

        const { name, description } = store,
            data = {
                name,
                description
            };

        let url = storesApi;

        if (store.id && parseInt(store.id) == store.id) {
            data.id = store.id;
            // Laravel uses POST requests with a pseudo-method `_method`
            // postfield for actions other than GET and POST.
            data._method = 'put';
            url = storeUpdateApi(store.id);
        }

        axios.post(url, data, getAuthHeaders())
            .then(response => {
                if (response.data.id) {
                    dispatch(addStoreHelper(response.data.id));
                }
            }).catch(error => {
                dispatch(addStoreErrors(
                    Object.values(error.response.data.errors)
                ));
            });
    }
}
