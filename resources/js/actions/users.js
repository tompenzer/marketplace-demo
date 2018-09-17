import axios, { getAuthHeaders } from "../api/axiosInstance";
import {
    USER_DETAILS,
    USERS_REQUESTED,
    USERS_ERROR,
    ORDER_CREATED,
    ORDER_REQUESTED,
    ORDER_ERRORS
} from "../api/strings";
import { getUserAPI, userOrderApi } from "../api/apiURLs";
import { cartUid } from "../actions/shoppingCart";

export const addUserHelper = (user = {}) => ({
    type: USER_DETAILS,
    user: user
});

export const usersRequested = () => ({
    type: USERS_REQUESTED
});

export const usersError = () => ({
    type: USERS_ERROR
});

export const addOrderHelper = (orderId = null) => ({
    type: ORDER_CREATED,
    orderId: orderId
});

export const orderRequested = () => ({
    type: ORDER_REQUESTED
});

export const addOrderErrors = (errors = []) => ({
    type: ORDER_ERRORS,
    orderErrors: errors
});


export const getUserInfo = () => {
    return (dispatch, getState) => {
        dispatch(usersRequested());

        axios.get(getUserAPI, getAuthHeaders())
            .then(response => {
                dispatch(addUserHelper(response.data));
            })
            .catch(error => {
                dispatch(usersError());
            });
    }
};

export const placeOrder = (address) => {
    return (dispatch, getState) => {
        dispatch(orderRequested());

        axios.post(userOrderApi(cartUid), address, getAuthHeaders())
            .then(response => {
                dispatch(addOrderHelper(response.data.id));
            })
            .catch(error => {
                dispatch(addOrderErrors(Object.values(error.response.data.errors)));
            });
    }
};
