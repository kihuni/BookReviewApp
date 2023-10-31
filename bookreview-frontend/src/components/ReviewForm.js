import React, { useState } from "react";
import api from "./api";
function ReviewForm({ bookId, onReviewAdded }) {
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(1);
    const [error, setError] = useState('');

    const handleStarClick = (starNunber) => {
        setRating(starNunber)
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const token = localStorage.getItem('token');

        const newReview = {
            content: content,
            rating: parseInt(rating),
        };

        onReviewAdded(newReview); 

        try {
            const response = await api.post(`/books/${bookId}/reviews/`, newReview, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                setContent('');
                setRating(1);
            } else {
                onReviewAdded(null);  
                setError('An error occurred. Please try again.');
            }

        } catch (error) {
            onReviewAdded(null);  
            setError('An error occurred. Please try again.');
        }
    }

    return (
        <div className="reviewForm">
        <form onSubmit={handleSubmit}>
            <textarea value={content} onChange={e => setContent(e.target.value)} />
            <div className="starRating">
                {[1, 2, 3, 4, 5].map(num => (
                    <span 
                        key={num} 
                        className={`star ${num <= rating ? 'filled' : ''}`} 
                        onClick={() => handleStarClick(num)}
                    >
                        ★
                    </span>
                ))}
            </div>
            <button type="submit">Submit Review</button>
        </form>
        {error && <p>{error}</p>}
    </div>
);
}

export default ReviewForm;
