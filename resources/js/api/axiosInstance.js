import axios from "axios"
import { ACCESS_TOKEN } from "./strings";

const axiosInstance = axios.create({
    baseURL: window.Laravel.base_url,
    timeout: 8000,
    headers: {
        'X-CSRF-TOKEN': window.Laravel.csrfToken,
        'X-Requested-With': 'XMLHttpRequest'
    }
});

export const getAuthHeaders = () => (
    {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${window.localStorage.getItem(ACCESS_TOKEN)}`
        }
    }
);

export default axiosInstance;
