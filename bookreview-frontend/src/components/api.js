import axios from 'axios';

const api = axios.create({
    baseURL: 'https://bookreviewapp.onrender.com'
});


api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
          
            localStorage.removeItem('token');
            
            
            
            window.location.href = "/login";  
        }
        return Promise.reject(error);
    }
);


export default api;
