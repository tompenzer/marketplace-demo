import axios, { getAuthHeaders } from "../api/axiosInstance";
import {
    USER_DETAILS,
    USERS_REQUESTED,
    USERS_ERROR,
    ORDER_CREATED,
    ORDER_REQUESTED,
    ORDER_ERRORS,
    ORDER_INFO,
    ORDER_INFO_REQUESTED,
    ORDER_INFO_ERROR,
    USER_ORDERS,
    ORDERS_REQUESTED,
    ORDERS_ERROR
} from "../api/strings";
import { getUserAPI, userOrderApi, userOrdersApi, userOrderInfoApi } from "../api/apiURLs";
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

export const addOrderInfoHelper = (order = {}) => ({
    type: ORDER_INFO,
    order
});

export const orderInfoRequested = () => ({
    type: ORDER_INFO_REQUESTED
});

export const orderInfoError = () => ({
    type: ORDER_INFO_ERROR
});

export const addUserOrdersHelper = (orders = []) => ({
    type: USER_ORDERS,
    orders
});

export const ordersRequested = () => ({
    type: ORDERS_REQUESTED
});

export const ordersError = () => ({
    type: ORDERS_ERROR
});

export const getUserInfo = () => {
    return (dispatch, getState) => {
        dispatch(usersRequested());

        axios.get(getUserAPI, getAuthHeaders())
            .then(response => {
                dispatch(addUserHelper(response.data));
            })
            .catch(() => {
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

export const getOrderInfo = (orderId) => {
    return (dispatch, getState) => {
        dispatch(orderInfoRequested());

        axios.get(userOrderInfoApi(orderId), getAuthHeaders())
            .then(response => {
                dispatch(addOrderInfoHelper(response.data));
            })
            .catch(() => {
                dispatch(orderInfoError());
            });
    }
};

export const getUserOrders = () => {
    return (dispatch, getState) => {
        dispatch(ordersRequested());

        axios.get(userOrdersApi, getAuthHeaders())
            .then(response => {
                dispatch(addUserOrdersHelper(response.data));
            })
            .catch(() => {
                dispatch(ordersError());
            });
    };
};
