import axios from "axios";

/** set the base URL for axios requests */
axios.defaults.baseURL = "https://drf-api-poetry.up.railway.app/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
// To avoid any CORS errors when sending cookies
axios.defaults.withCredentials = true;

/** create two instances of axios to attach interceptors
    for requests and responses. */
export const axiosReq = axios.create();
export const axiosRes = axios.create();
