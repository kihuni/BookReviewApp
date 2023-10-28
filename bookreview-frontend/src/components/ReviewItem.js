import React from "react";
import api from "./api";

function ReviewItem({ review, onVote }) {
    const handleVote = async (voteType) => {
        const token = localStorage.getItem('token');

        try {
            const response = await api.post(`https://bookreviewapp.onrender.com/reviews/${review.id}/vote/`, {
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
        <div>
            <p>{review.content}</p>
            <p>Rating: {review.rating}</p>
            <button onClick={() => handleVote(1)}>Upvote</button>
            <button onClick={() => handleVote(-1)}>Downvote</button>
        </div>
    );
}

export default ReviewItem;
