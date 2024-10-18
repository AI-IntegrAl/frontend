import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // Your backend URL
  withCredentials: true, // Include cookies in requests
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add any custom logic here, like adding an authorization token
    // For example, if you store a token in local storage, you can add it here
    // const token = localStorage.getItem('access_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error statuses here
    if (error.response) {
      if (error.response.status === 401) {
        // Handle unauthorized access (e.g., redirect to login)
        console.error("Unauthorized! Please log in again.");
      } else if (error.response.status === 403) {
        // Handle forbidden access
        console.error("Forbidden! You do not have access.");
      } else {
        console.error("An error occurred:", error.response.data);
      }
    } else {
      console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
