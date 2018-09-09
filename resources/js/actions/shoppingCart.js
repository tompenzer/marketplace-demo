import uuid from 'uuid';
import axios from "../api/axiosInstance";
import { ACCESS_TOKEN, CART_UID, ADD_TO_CART, EDIT_CART, EMPTY_CART, REMOVE_FROM_CART } from "../api/strings";
import { addToCartApi, editCartApi, removeFromCartApi, userCartApi } from "../api/apiURLs";

export let cartUid = window.localStorage.getItem(CART_UID);

if (! cartUid) {
    cartUid = uuid();

    window.localStorage.setItem(CART_UID, cartUid);
}

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
export const editCartHelper = (productId, updates) => ({
    type: EDIT_CART,
    productId,
    updates
});

// EMPTY_CART
export const emptyCart = () => ({
    type: EMPTY_CART
});

export const getCart = () => {
    return (dispatch, getState) => {
        axios.get(userCartApi(cartUid))
            .then((response) => {
                response.data.map((item) => {
                    dispatch(addToCartHelper({
                        productId: item.product_id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        currency: item.currency
                    }));
                })
            })
            .catch((error) => {
                console.log(error.response);
            });
    }
};

export const removeFromCart = ({ productId } = {}) => {
    return (dispatch, getState) => {
        axios.post(removeFromCartApi(cartUid, productId), { _method: 'delete' })
            .then((response) => {
                dispatch(removeFromCartHelper(productId));
            })
            .catch((error) => {
                console.log(error.response);
            });
    }
};

export const addToCart = (product = {}) => {
    return (dispatch, getState) => {
        // make an API call
        const { productId, name, quantity, price, currency } = product;
        const data = {
            product_id: productId,
            name,
            quantity,
            price,
            currency
        };

        axios.post(addToCartApi(cartUid), data)
            .then((response) => {
                dispatch(addToCartHelper(product));
            })
            .catch((error) => {
                console.log(error.response);
            });
    }
};

export const editCart = (productId, update = {}) => {
    return (dispatch, getState) => {
        const data = {
            ...update,
            _method: 'put'
        }

        axios.post(editCartApi(cartUid, productId), data)
            .then((response) => {
                dispatch(editCartHelper(productId, update));
            })
            .catch((error) => {
                console.log(error.response);
            });
    }
};
