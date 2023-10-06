// src/components/BookDetail.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookDetail = ({ match }) => {
    const [book, setBook] = useState(null);

    useEffect(() => {
        async function fetchBook() {
            try {
                const response = await axios.get(`http://localhost:8000/api/books/${match.params.id}/`);
                setBook(response.data);
            } catch (error) {
                console.error("Error fetching book details:", error);
            }
        }

        fetchBook();
    }, [match.params.id]);

    if (!book) return <div>Loading...</div>;

    return (
        <div>
            <h2>{book.title}</h2>
            <p>By {book.author}</p>
            <p>{book.description}</p>
        </div>
    );
}

export default BookDetail;
