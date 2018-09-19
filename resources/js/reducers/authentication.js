// default state
import {
    LOG_IN,
    LOG_IN_REQUESTED,
    LOG_IN_ERROR,
    LOG_OUT,
    USER_CREATED,
    USER_CREATE_REQUESTED,
    USER_CREATE_ERRORS
} from "../api/strings";

const authenticationReducerDefaultState = {
    isAuthenticated: null,
    loginRequested: false,
    loginFailed: false,
    userCreated: false,
    registrationRequested: false,
    registrationErrors: []
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
                isAuthenticated: false,
                loginRequested: false,
                loginFailed: true
            };
        case LOG_OUT:
            return {
                ...state,
                isAuthenticated: false,
                loginRequested: false,
                loginFailed: false
            };
        case USER_CREATED:
            return {
                ...state,
                userCreated: true,
                registrationRequested: false,
                registrationErrors: []
            };
        case USER_CREATE_REQUESTED:
            return {
                ...state,
                userCreated: false,
                registrationRequested: true,
                registrationErrors: []
            };
        case USER_CREATE_ERRORS:
            return {
                ...state,
                userCreated: false,
                registrationRequested: false,
                registrationErrors: action.registrationErrors
            };
        default:
            return state;
    }
};
