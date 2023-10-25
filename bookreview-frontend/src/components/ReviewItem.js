import React from "react";
import axios from 'axios';

function ReviewItem({ review, onVote }) {
    const handleVote = async (voteType) => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(`kihuni.pythonanywhere.com/reviews/${review.id}/vote/`, {
                value: voteType
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                onVote(review.id, voteType);  
            } else {
                console.error("Error status:", response.status);
            }

        } catch (error) {
            console.error("Error casting vote:", error);
        }
    }

    return (
        <div className="reviewitems">
        <p>{review.content}</p>
        <div className="starRating">
            {[1, 2, 3, 4, 5].map(num => (
                <span key={num} className={`star ${num <= review.rating ? 'filled' : ''}`}>
                    ★
                </span>
            ))}
        </div>
        ...
    </div>
);
}

export default ReviewItem;
