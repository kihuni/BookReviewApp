import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from './api';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        async function fetchBookDetails() {
            try {
                const bookResponse = await api.get(`https://www.googleapis.com/books/v1/volumes/${id}`);
                setBook(bookResponse.data.volumeInfo);
            } catch (error) {
                console.error("Error fetching book details:", error);
            }
        }

        fetchBookDetails();
    }, [id]);

    if (!book) return <div>Loading...</div>;

    // Construct the URL for reading the book on Google Books
    const readUrl = `https://books.google.com/books?id=${id}`;

    return (
        <div className='bookdetails'>
            <img src={book.imageLinks?.thumbnail} alt={book.title} className="bookCover" />
            <h2>{book.title}</h2>
            <p>By {book.authors?.join(', ')}</p>

            {/* Render HTML content */}
            <div dangerouslySetInnerHTML={{ __html: book.description }} />

            <a href={readUrl} target="_blank" rel="noopener noreferrer">Read on Google Books</a>
        </div>
    );
}

export default BookDetail;
