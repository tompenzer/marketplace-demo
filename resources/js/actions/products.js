import axios, { getAuthHeaders } from "../api/axiosInstance";
import {
    PRODUCTS,
    PRODUCTS_REQUESTED,
    PRODUCTS_ERROR,
    PRODUCTS_INVALIDATE,
    PRODUCT_DETAILS,
    PRODUCT_CREATED,
    PRODUCT_CREATE_ERRORS
} from "../api/strings";
import { productsApi, productInfoAPI, productUpdateApi } from "../api/apiURLs";

export const addProductsHelper = (products = []) => ({
    type: PRODUCTS,
    products: products
});

export const productsRequested = () => ({
    type: PRODUCTS_REQUESTED
});

export const productsError = () => ({
    type: PRODUCTS_ERROR
});

export const invalidateProducts = () => ({
    type: PRODUCTS_INVALIDATE
});

export const addProductDetailsHelper = (productDetails = {}) => ({
    type: PRODUCT_DETAILS,
    productDetails: productDetails
});

export const addProductHelper = (productId = null) => ({
    type: PRODUCT_CREATED,
    productId: productId
});

export const addProductErrors = (errors = []) => ({
    type: PRODUCT_CREATE_ERRORS,
    productCreateErrors: errors
});

export const loadProducts = (query = '') => {
    return (dispatch, getState) => {
        dispatch(productsRequested());

        let options = {};

        if (query) {
            options.params = { q: query };
        }

        axios.get(productsApi, options)
            .then(response => dispatch(addProductsHelper(response.data.data)))
            .catch(error => dispatch(productsError()));
    };
};


export const loadProductDetails = (productId) => {
    return (dispatch, getState) => {
        dispatch(productsRequested());

        axios.get(productInfoAPI(productId))
            .then(response => dispatch(addProductDetailsHelper(response.data)))
            .catch(error => dispatch(productsError()));
    };
};

export const saveProduct = (product) => {
    return (dispatch, getState) => {
        dispatch(productsRequested());

        const {
                store_id,
                name,
                description,
                width,
                width_unit_id,
                height,
                height_unit_id,
                length,
                length_unit_id,
                weight,
                weight_unit_id,
                price,
                currency_id
            } = product,
            data = {
                store_id,
                name,
                description,
                width,
                width_unit_id,
                height,
                height_unit_id,
                length,
                length_unit_id,
                weight,
                weight_unit_id,
                price,
                currency_id
            };

        let url = productsApi;

        if (product.id && parseInt(product.id) == product.id) {
            data.id = product.id;
            // Laravel uses POST requests with a pseudo-method `_method`
            // postfield for actions other than GET and POST.
            data._method = 'put';
            url = productUpdateApi(product.id);
        }

        axios.post(url, data, getAuthHeaders())
            .then(response => {
                if (response.data.id) {
                    dispatch(addProductHelper(response.data.id));
                }
            }).catch(error => {
                dispatch(addProductErrors(
                    Object.values(error.response.data.errors)
                ));
            });
    }
}
