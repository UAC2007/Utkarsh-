import axios from 'axios';

// Create axios instance with base config
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:4000",
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete config.headers['Authorization']; // Remove if not set
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const getCall = (url, config = {}) => axiosInstance.get(url, config);

export const postCall = (url, data, config = {}) => axiosInstance.post(url, data, config);

export const putCall = (url, data, config = {}) => axiosInstance.put(url, data, config);

export const deleteCall = (url, config = {}) => axiosInstance.delete(url, config);

export default axiosInstance;