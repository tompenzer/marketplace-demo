import {
    USER_DETAILS,
    USERS_REQUESTED,
    USERS_ERROR,
    ORDER_CREATED,
    ORDER_REQUESTED,
    ORDER_ERRORS,
    CART_REQUESTED,
    CART_ERROR,
    CART_TOTALS,
    ORDER_INFO,
    ORDER_INFO_REQUESTED,
    ORDER_INFO_ERROR,
    USER_ORDERS,
    ORDERS_REQUESTED,
    ORDERS_ERROR
} from "../api/strings";

// Cart totals is part of the users store since shoppingCart store is a flat
// array of items.
const usersReducerDefaultState = {
    user: {},
    usersRequested: false,
    usersError: false,
    orderCreated: null,
    orderRequested: false,
    orderErrors: [],
    order: {},
    orderInfoRequested: false,
    orderInfoError: false,
    orders: [],
    ordersRequested: false,
    ordersError: false,
    cartTotals: {},
    cartRequested: false,
    cartError: false
};

export default (state = usersReducerDefaultState, action) => {
    switch (action.type) {
        case USER_DETAILS:
            return {
                ...state,
                user: action.user,
                usersRequested: false,
                usersError: false
            };
        case USERS_REQUESTED:
            return {
                ...state,
                usersRequested: true,
                usersError: false
            };
        case USERS_ERROR:
            return {
                ...state,
                usersRequested: false,
                usersError: true
            };
        case ORDER_CREATED:
            return {
                ...state,
                orderCreated: action.orderId,
                orderRequested: false,
                orderErrors: []
            };
        case ORDER_REQUESTED:
            return {
                ...state,
                orderRequested: true,
                orderErrors: []
            };
        case ORDER_ERRORS:
            return {
                ...state,
                orderCreated: null,
                orderRequested: false,
                orderErrors: action.orderErrors
            };
        case CART_TOTALS:
            return {
                ...state,
                cartTotals: action.cartTotals,
                cartRequested: false,
                cartError: false
            };
        case CART_REQUESTED:
            return {
                ...state,
                cartTotals: {},
                cartRequested: true,
                cartError: false
            };
        case CART_ERROR:
            return {
                ...state,
                cartTotals: {},
                cartRequested: false,
                cartError: true
            };
        case ORDER_INFO:
            return {
                ...state,
                order: action.order,
                orderInfoRequested: false,
                orderInfoError: false
            };
        case ORDER_INFO_REQUESTED:
            return {
                ...state,
                order: {},
                orderInfoRequested: true,
                orderInfoError: false
            };
        case ORDER_INFO_ERROR:
            return {
                ...state,
                order: {},
                orderInfoRequested: false,
                orderInfoError: true
            };
        case USER_ORDERS:
            return {
                ...state,
                orders: action.orders,
                ordersRequested: false,
                ordersError: false
            };
        case ORDERS_REQUESTED:
            return {
                ...state,
                orders: {},
                ordersRequested: true,
                ordersError: false
            };
        case ORDERS_ERROR:
            return {
                ...state,
                orders: {},
                ordersRequested: false,
                ordersError: true
            };
        default:
            return state;
    }
};
