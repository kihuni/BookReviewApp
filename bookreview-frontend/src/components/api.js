import axios from 'axios';

const api = axios.create({
    baseURL: 'https://bookreviewapp.onrender.com/'
});

const unauthorizedCallbacks = [];

api.addUnauthorizedCallback = (callback) => {
    unauthorizedCallbacks.push(callback);
};

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            unauthorizedCallbacks.forEach(callback => callback());
        }
        return Promise.reject(error);
    }
);

api.unauthorizedCallbacks = unauthorizedCallbacks;

export default api;

