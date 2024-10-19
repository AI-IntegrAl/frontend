import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";

function useAxiosInstance() {
  const { access_token: token } = useSelector((state) => state.user);


  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        if (error.response.status === 401) {
          console.error("Unauthorized! Please log in again.");
        } else if (error.response.status === 403) {
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


  return {
    axiosInstance,
  };
}

export default useAxiosInstance;
