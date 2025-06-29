import axios from 'axios';

// Create axios instance with base config
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:4000",
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
    },
    withCredentials: true
});

export const getCall = (url, config = {}) => axiosInstance.get(url, config);

export const postCall = (url, data, config = {}) => axiosInstance.post(url, data, config);

export const putCall = (url, data, config = {}) => axiosInstance.put(url, data, config);

export const deleteCall = (url, config = {}) => axiosInstance.delete(url, config);

export default axiosInstance;