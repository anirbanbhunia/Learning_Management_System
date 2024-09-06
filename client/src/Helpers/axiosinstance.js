import axios from "axios";

const baseUrl = "http://localhost:8000/api/v1"

const axiosInstance = axios.create()

axiosInstance.defaults.baseURL = baseUrl //This sets the base URL for all requests made with this Axios instance. Instead of writing the full URL for each request, you can now just specify the endpoint, and Axios will automatically prepend the base URL.

axiosInstance.defaults.withCredentials = true //This is a configuration option that tells Axios to include credentials (like cookies, authorization headers, etc.) in cross-origin requests. It’s often used when making requests to APIs that require authentication.

export default axiosInstance