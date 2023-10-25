import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../style.css';

const BookList = ({ user }) => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        async function fetchBooks() {
            try {
                const response = await axios.get('kihuni.pythonanywhere.com/books');
                setBooks(response.data);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        }

        fetchBooks();
    }, []);

    return (
        <div>
            <div className="ListHeader">
                <div>
                    <div className="inlineDiv"></div>
                    <h2>Meet your <span>Next</span> favorite Book</h2>
                    <p>From your favorite <span>Author</span></p>
                </div>
            </div>

            <div className="headerList">
                {books.map(book => (
                    <div 
                        key={book.id} 
                        className={`containerList ${user && book.user && book.user.id === user.id ? 'userBook' : ''}`}
                    >
                        <img src={book.cover_image} alt={book.title} />
                        <h2 className="bookList">
                           <Link to={`/books/${book.id}`}><span>Book Title:</span> {book.title}</Link> 
                        </h2>
                        <p className="booklist"><span>By </span>{book.author}</p>
                        {user && book.user && book.user.id === user.id && <p>(Your Book)</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BookList;
