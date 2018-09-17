import {
    USER_DETAILS,
    USERS_REQUESTED,
    USERS_ERROR,
    ORDER_CREATED,
    ORDER_REQUESTED,
    ORDER_ERRORS
} from "../api/strings";

const usersReducerDefaultState = {
    user: {},
    usersRequested: false,
    usersError: false,
    orderCreated: null,
    orderRequested: false,
    orderErrors: []
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
        default:
            return state;
    }
};
