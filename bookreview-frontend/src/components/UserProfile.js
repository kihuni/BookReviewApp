import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from './api';
import '../style.css';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [userBooks, setUserBooks] = useState([]);
    const [readingChallenge, setReadingChallenge] = useState(null);
    const [recommendedBooks, setRecommendedBooks] = useState([]); 

    useEffect(() => {
        async function fetchUserAndBooks() {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            try {
                const userResponse = await api.get('/user-profile/', config);
                setUser(userResponse.data);

                const booksResponse = await api.get('/user-books/', config);
                setUserBooks(booksResponse.data);

                const challengeResponse = await api.get('/reading-challenge/', config);
                setReadingChallenge(challengeResponse.data);

                // Fetch recommended books
                const recommendedBooksResponse = await api.get('/books/recommendations/', config);
                setRecommendedBooks(recommendedBooksResponse.data);
            } catch (error) {
                console.error('Error fetching user profile and books:', error);
            }
        }

        fetchUserAndBooks();
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="userProfile">
            <h3>Your Books:</h3>
            {userBooks.map((book) => (
                <div key={book.id}>
                    <h4>{book.title}</h4>
                    <p>By {book.author}</p>
                    <Link to={`/books/edit/${book.id}`}>Edit</Link>
                </div>
            ))}

            <Link to="/create">Create New Book</Link>

            {/* Display reading challenge status */}
            {readingChallenge && (
                <div>
                    <h3>Reading Challenge</h3>
                    <p>Status: {readingChallenge.status}</p>
                    <p>Goal: {readingChallenge.goal}</p>
                    <p>Books Read: {readingChallenge.booksRead}</p>
                </div>
            )}

            {/* Display recommended books */}
            {recommendedBooks.length > 0 && (
                <div>
                    <h3>Recommended Books</h3>
                    {recommendedBooks.map((book) => (
                        <div key={book.title}>
                            <h4>{book.title}</h4>
                            <p>By {book.author}</p>
                            <p>{book.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserProfile;
