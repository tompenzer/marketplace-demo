import uuid from 'uuid';
import axios from "../api/axiosInstance";
import {ACCESS_TOKEN, ADD_TO_CART, EDIT_CART, EMPTY_CART, REMOVE_FROM_CART} from "../api/strings";
import {addToCartAPI, removeFromCartAPI} from "../api/apiURLs";
// ADD_TO_CART
export const addToCartHelper = (
    {
        productId,
        name,
        quantity = 1,
        price,
        currency
    } = {}
) => ({
    type: ADD_TO_CART,
    shoppingCart: {
        productId,
        name,
        quantity,
        price,
        currency
   }
});

// REMOVE_FROM_CART
const removeFromCartHelper = (productId) => ({
    type: REMOVE_FROM_CART,
    productId
});

// EDIT_CART
export const editCart = (productId, updates) => ({
    type: EDIT_CART,
    productId,
    updates
});

// EMPTY_CART
export const emptyCart = () => ({
    type: EMPTY_CART
});

export const removeFromCart = ({ productId } = {}) => {
    return (dispatch, getState) => {
        const {authentication} = getState();
        if(authentication.isAuthenticated){
            // make an API call
            const access_token = window.localStorage.getItem(ACCESS_TOKEN);
            const headers = {Accept: "application/json", Authorization: `Bearer ${access_token}`};

            axios.delete(removeFromCartAPI(productId), {headers: {...headers}})
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.log(error.response);
                });
        }
        dispatch(removeFromCartHelper(productId));
    }
};

export const addToCart = (product = {}) => {
    return (dispatch, getState) => {
        const {authentication} = getState();
        if(authentication.isAuthenticated){
            // make an API call
            const access_token = window.localStorage.getItem(ACCESS_TOKEN);
            const headers = {Accept: "application/json", Authorization: `Bearer ${access_token}`};
            const {productId, name, quantity, price, currency} = product;
            const data = {
                product_id: productId,
                name,
                quantity: 1,
                price,
                currency
            };
            axios.post(addToCartAPI, data, {headers: {...headers}})
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.log(error.response);
                });
        }
        dispatch(addToCartHelper(product));
    }
};
