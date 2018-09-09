import axios, { getAuthHeaders } from "../api/axiosInstance";
import { getUserAPI, logoutAPI } from "../api/apiURLs";
import { ACCESS_TOKEN, LOG_IN, LOG_OUT, REFRESH_TOKEN } from "../api/strings";

export const loginUser = () => ({
    type: LOG_IN
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
