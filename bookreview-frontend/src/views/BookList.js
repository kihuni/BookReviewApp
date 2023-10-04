import React, {useState, useEffect} from "react";
import {getBooks} from '../services/api'

const BookList = () => {
    const [books, setBooks] = useState([]);


    useEffect(() =>{
        getBooks().then(response => {
            setBooks(response.data)
        })
    }, []);
}
export default BookList;