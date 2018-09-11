// default state
import { LOG_IN, LOG_IN_REQUESTED, LOG_IN_ERROR, LOG_OUT } from "../api/strings";

const authenticationReducerDefaultState = {
    isAuthenticated: false,
    loginRequested: false,
    loginFailed: false
};

// reducer which is a pure function
export default (state = authenticationReducerDefaultState, action) => {
    switch (action.type) {
        case LOG_IN:
            return {
                ...state,
                isAuthenticated: true,
                loginRequested: false,
                loginFailed: false
            };
        case LOG_IN_REQUESTED:
            return {
                ...state,
                loginRequested: true,
                loginFailed: false,
            };
        case LOG_IN_ERROR:
            return {
                ...state,
                loginRequested: false,
                loginFailed: true
            };
        case LOG_OUT:
            return {
                ...state,
                ...authenticationReducerDefaultState
            };
        default:
            return state;
    }
};
