// Api callS

import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

export const getBooks = () =>{
    return axios.get(`${API_URL}books/`);
}

export const getBookDetails = (bookId) => {
    return axios.get(`${API_URL}books/${bookId}`);
}