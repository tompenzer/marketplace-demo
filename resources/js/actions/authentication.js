import axios, { getAuthHeaders } from "../api/axiosInstance";
import { getUserAPI, loginAPI, logoutAPI, registerAPI } from "../api/apiURLs";
import {
    ACCESS_TOKEN,
    REFRESH_TOKEN,
    LOG_IN,
    LOG_IN_REQUESTED,
    LOG_IN_ERROR,
    LOG_OUT,
    USER_CREATED,
    USER_CREATE_REQUESTED,
    USER_CREATE_ERRORS
} from "../api/strings";

export const loginUser = () => ({
    type: LOG_IN
});

export const loginRequested = () => ({
    type: LOG_IN_REQUESTED
});

export const loginError = () => ({
    type: LOG_IN_ERROR
});

export const logoutUser = () => ({
    type: LOG_OUT
});

export const userCreated = () => ({
    type: USER_CREATED
});

export const registrationRequested = () => ({
    type: USER_CREATE_REQUESTED
});

export const registrationErrors = (errors = []) => ({
    type: USER_CREATE_ERRORS,
    registrationErrors: errors
});

export const checkLogin = () => {
    return (dispatch, getState) => {
        if (window.localStorage.getItem(ACCESS_TOKEN) !== null) {
            axios.get(getUserAPI, getAuthHeaders())
                .then(() => {
                    dispatch(loginUser());
                })
                .catch((error) => {
                    window.localStorage.removeItem(ACCESS_TOKEN);
                    dispatch(logoutUser());
                });
        } else {
            dispatch(logoutUser());
        }
    }
};

export const logIn = (email, password) => {
    return (dispatch, getState) => {
        const data = {
          grant_type: "password",
          client_id: window.Laravel.clientId,
          client_secret: window.Laravel.clientSecret,
          username: email,
          password: password,
          scope: "*"
        };

        dispatch(loginRequested());

        axios.post(loginAPI, data)
            .then((response) => {
                window.localStorage.setItem(ACCESS_TOKEN, response.data.access_token);
                window.localStorage.setItem(REFRESH_TOKEN, response.data.refresh_token);
                dispatch(loginUser());
            })
            .catch((error) => {
                dispatch(loginError());
            });
    }
}

export const logOut = () => {
    return (dispatch, getState) => {
        axios.post(logoutAPI, {}, getAuthHeaders())
            .then(() => {
                window.localStorage.removeItem(ACCESS_TOKEN);
                window.localStorage.removeItem(REFRESH_TOKEN);
                dispatch(logoutUser());
            });
    }
}

export const registerUser = (
    {
        name,
        email,
        password,
        password_confirmation
    } = {}
) => {
    return (dispatch, getState) => {
        dispatch(registrationRequested());

        const data = {
            name,
            email,
            password,
            password_confirmation
        };

        axios.post(registerAPI, data)
            .then(response => {
                if (response.status === 200) {
                    dispatch(userCreated());
                }
            })
            .catch(error => {
                dispatch(registrationErrors(
                    Object.values(error.response.data.errors)
                ));
            });
    };
};
