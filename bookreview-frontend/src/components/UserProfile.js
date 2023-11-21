import React, { useState, useEffect } from 'react';
import api from './api';
import '../style.css';

const UserProfile = ({ selectedBookId }) => {
  const [userSelectedBooks, setUserSelectedBooks] = useState([]);
  const [readingChallenge, setReadingChallenge] = useState(null);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching user profile data...');
    const fetchUserProfileData = async () => {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      try {
        // Fetch user's selected books
        const selectedBooksResponse = await api.get('/user-profile/user_books/', config);
        setUserSelectedBooks(selectedBooksResponse.data);

        // Fetch user's reading challenge
        const challengeResponse = await api.get('/reading-challenge/', config);
        setReadingChallenge(challengeResponse.data);

        // Fetch recommended books based on the selected book
        if (selectedBookId) {
          const recommendedBooksResponse = await api.get(`/books/${selectedBookId}/recommendations/`, config);
          setRecommendedBooks(recommendedBooksResponse.data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile data:', error);

        if (error.response) {
          // Handle different types of errors (server, network, etc.)
        }

        setError('Error fetching user profile data. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserProfileData();
  }, [selectedBookId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="userProfile">
      {/* Render user's selected books */}
      <h3>Your Selected Books:</h3>
        {userSelectedBooks && userSelectedBooks.length > 0 ? (
          userSelectedBooks.map((selectedBook) => (
            <div key={selectedBook.id} className={`containerList`}>
              <h2 className="bookList">
                <span>Book Title:</span> {selectedBook.book && selectedBook.book.title}
              </h2>
              <p className="booklist">
                <span>By </span>
                {selectedBook.book && selectedBook.book.author}
              </p>
              <p>{selectedBook.book && selectedBook.book.description}</p>
            </div>
          ))
        ) : (
          <p>No selected books.</p>
        )}


      {/* Render user's reading challenge */}
      {readingChallenge && (
        <div>
          <h3>Reading Challenge</h3>
          <p>Status: {readingChallenge.status}</p>
          <p>Goal: {readingChallenge.goal}</p>
          <p>Books Read: {readingChallenge.booksRead}</p>
        </div>
      )}

      {/* Render recommended books */}
      {recommendedBooks.length > 0 ? (
        <div>
          <h3>Recommended Books</h3>
          {recommendedBooks.map((book) => (
              <div key={book.title}>
                {book.title && <h4>{book.title}</h4>}
                {book.author && <p>By {book.author}</p>}
                {book.description && <p>{book.description}</p>}
              </div>
            ))}
        </div>
      ) : (
        <p>No recommended books.</p>
      )}
    </div>
  );
};

export default UserProfile;
