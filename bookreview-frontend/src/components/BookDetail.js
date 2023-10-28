import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReviewForm from './ReviewForm';
import ReviewItem from './ReviewItem';
import api from './api';

const BookDetail = () => {
    const { id } = useParams();
    
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        async function fetchBookAndReviews() {
            try {
                const bookResponse = await api.get(`https://bookreviewapp.onrender.com/${id}`);
                setBook(bookResponse.data);

                const reviewResponse = await api.get(`https://bookreviewapp.onrender.com/${id}/reviews/`);
                setReviews(reviewResponse.data);
            } catch (error) {
                console.error("Error fetching book details:", error);
            }
        }

        fetchBookAndReviews();
    }, [id]);

    const handleReviewAdded = (newReview) => {
        if (newReview) {
            setReviews(prevReviews => [newReview, ...prevReviews]);  
        }
    };

    if (!book) return <div>Loading...</div>;

    return (
        <div className='bookdetails'>
            <img src={book.cover_image} alt={book.title} className="bookCover" />
            <h2>{book.title}</h2>
            <p>By {book.author}</p>
            <p>{book.description}</p>
            <ReviewForm bookId={book.id} onReviewAdded={handleReviewAdded} />
            {reviews.map(review => (
                <ReviewItem key={review.id} review={review} />
            ))}
        </div>
    );
}

export default BookDetail;
