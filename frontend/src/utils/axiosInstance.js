import axios from 'axios';
import { API_BASE_URL } from './apiPaths';


const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000, // Increased timeout
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    validateStatus: status => status >= 200 && status < 300, // Explicitly validate status codes
});

// REQUEST INTERCEPT
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// RESPONSE INTERCEPTER
axiosInstance.interceptors.response.use(
    (response) => {
        // Ensure we have a valid response with data
        if (!response || !response.data) {
            return Promise.reject(new Error('No data received'));
        }
        return response;
    },
    (error) => {
        // Network or timeout errors
        if (!error.response) {
            console.error('Network Error:', error.message);
            if (error.code === 'ECONNABORTED') {
                console.error('Request Timeout');
            }
            return Promise.reject(new Error('Network error, please check your connection'));
        }

        // Handle specific status codes
        switch (error.response.status) {
            case 401:
                // Clear invalid tokens
                localStorage.removeItem('token');
                window.location.href = '/';
                break;
            case 403:
                console.error('Access Forbidden');
                break;
            case 404:
                console.error('Resource Not Found');
                break;
            case 500:
                console.error('Server Error');
                break;
            default:
                console.error(`Error ${error.response.status}:`, error.response.data);
        }

        // Include response data in the error if available
        const errorMessage = error.response.data?.message || error.message;
        return Promise.reject(new Error(errorMessage));
    }
);

export default axiosInstance;