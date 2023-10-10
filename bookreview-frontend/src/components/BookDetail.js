import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BookDetail = () => {
    const { id } = useParams();
    
    const [book, setBook] = useState(null);

    useEffect(() => {
        async function fetchBook() {
            try {
                const response = await axios.get(`http://localhost:8000/books/${id}`);
                setBook(response.data);
            } catch (error) {
                console.error("Error fetching book details:", error);
            }
        }

        fetchBook();
    }, [id]);

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
