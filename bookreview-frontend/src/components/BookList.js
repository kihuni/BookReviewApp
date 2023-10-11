import React, { useState, useEffect} from "react";
import axios from 'axios'
import '../style.css'
const BookList = () => {
    const [books, setBooks ] = useState([]);

    useEffect(() => {
        async function fetchBooks() {
            try {
               const response = await axios.get('http://127.0.0.1:8000/books');
               setBooks(response.data); 
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        }

        fetchBooks();
    }, []);

    return (
        <div className="headerList">
            {books.map(book =>(
                <div key={book.id} className="containerList">
                    <h2 className="bookList"><span>Book Title:</span> {book.title}</h2>
                    <p className="booklist"><span>By </span>{book.author}</p>
                </div>
            ))}
        </div>
    );
}

export default BookList;