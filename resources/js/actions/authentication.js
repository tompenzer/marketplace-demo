import axios, { getAuthHeaders } from "../api/axiosInstance";
import { getUserAPI, loginAPI, logoutAPI } from "../api/apiURLs";
import { ACCESS_TOKEN, LOG_IN, LOG_IN_REQUESTED, LOG_IN_ERROR, LOG_OUT, REFRESH_TOKEN } from "../api/strings";

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

export const checkLogin = () => {
    return (dispatch, getState) => {
        axios.get(getUserAPI, getAuthHeaders())
            .then(() => {
                dispatch(loginUser());
            })
            .catch((error) => {
                window.localStorage.removeItem(ACCESS_TOKEN);
                dispatch(logoutUser());
            });
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
