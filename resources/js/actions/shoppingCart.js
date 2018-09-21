import uuid from 'uuid';
import axios from "../api/axiosInstance";
import {
    ACCESS_TOKEN,
    CART_UID,
    ADD_TO_CART,
    EDIT_CART,
    CART_EDIT_REQUESTED,
    CART_EDIT_COMPLETED,
    CART_EDIT_ERRORS,
    EMPTY_CART,
    REMOVE_FROM_CART,
    CART_REMOVE_REQUESTED,
    CART_REQUESTED,
    CART_ERROR,
    CART_TOTALS
} from "../api/strings";
import { addToCartApi, editCartApi, removeFromCartApi, userCartApi, userCartTotalsApi } from "../api/apiURLs";

export let cartUid = window.localStorage.getItem(CART_UID);

if (! cartUid) {
    cartUid = uuid();

    window.localStorage.setItem(CART_UID, cartUid);
}

// Handled by users reducer, state stored in users store
export const cartRequested = () => ({
    type: CART_REQUESTED
});

// Handled by users reducer, state stored in users store
export const cartError = () => ({
    type: CART_ERROR
});

// Handled by users reducer, state stored in users store
export const cartRemovalRequested = () => ({
    type: CART_REMOVE_REQUESTED
});

// Handled by users reducer, state stored in users store
export const cartRemovalCompleted = () => ({
    type: CART_REMOVE_COMPLETED
});

// Handled by users reducer, state stored in users store
export const cartEditRequested = () => ({
    type: CART_EDIT_REQUESTED
});

// Handled by users reducer, state stored in users store
export const cartEditCompleted = () => ({
    type: CART_EDIT_COMPLETED
});

// Handled by users reducer, state stored in users store
export const cartEditErrors = (errors = []) => ({
    type: CART_EDIT_ERRORS,
    cartEditErrors: errors
});

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

export const addCartTotalsHelper = (
    {
        subtotal,
        shipping,
        taxes,
        total
    } = {}
) => ({
    type: CART_TOTALS,
    cartTotals: {
        subtotal,
        shipping,
        taxes,
        total
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
        dispatch(cartRequested());

        axios.get(userCartApi(cartUid))
            .then(response => {
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
            .catch(error => {
                dispatch(cartError());
            });
    }
};

export const removeFromCart = ({ productId } = {}) => {
    return (dispatch, getState) => {
        // Since the shoppingCart redux store is just a flat array of  items,
        // we're dispatching additional actions to the user store to track the
        // request cycle.
        dispatch(cartRemovalRequested());

        axios.post(removeFromCartApi(cartUid, productId), { _method: 'delete' })
            .then(response => {
                dispatch(removeFromCartHelper(productId));
                dispatch(cartRemovalCompleted());
            })
            .catch(error => {
                dispatch(cartError());
                dispatch(cartRemovalCompleted());
            });
    }
};

export const addToCart = (product = {}) => {
    return (dispatch, getState) => {
        dispatch(cartRequested());

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
            .then(response => {
                dispatch(addToCartHelper(product));
            })
            .catch(error => {
                dispatch(cartError());
            });
    }
};

export const editCart = (productId, update = {}) => {
    return (dispatch, getState) => {
        dispatch(cartEditRequested());

        const data = {
            ...update,
            _method: 'put'
        }

        axios.post(editCartApi(cartUid, productId), data)
            .then(response => {
                dispatch(editCartHelper(productId, update));
                dispatch(cartEditCompleted());
            })
            .catch(error => {
                dispatch(cartEditErrors(
                    Object.values(error.response.data.errors)
                ));
            });
    }
};

export const getCartTotals = () => {
    return (dispatch, getState) => {
        dispatch(cartRequested());

        axios.get(userCartTotalsApi(cartUid))
            .then(response => {
                dispatch(addCartTotalsHelper(response.data));
            })
            .catch(error => {
                dispatch(cartError());
            });

    }
}
