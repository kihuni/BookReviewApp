import React, { useState, useEffect} from "react";
import axios from 'axios'

const BookList = () => {
    const [books, setBooks ] = useState([]);

    useEffect(() => {
        async function fetchBooks() {
            try {
               const response = await axios.get('http://127.0.0.1:8000/reviews/books');
               setBooks(response.data); 
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        }

        fetchBooks();
    }, []);

    return (
        <div>
            {books.map(book =>(
                <div key={book.id}>
                    <h2>{book.title}</h2>
                    <h2>By {book.author}</h2>
                </div>
            ))}
        </div>
    );
}

export default BookList;