import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Here you could add the auth token to headers
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Here you could handle global errors, e.g. 401 unauthorized
    // if (error.response && error.response.status === 401) {
    //   // handle unauthorized error, e.g. redirect to login
    // }
    return Promise.reject(error);
  }
);

export default axiosInstance;
