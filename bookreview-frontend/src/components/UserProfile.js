import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from './api';
import '../style.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [userSelectedBooks, setUserSelectedBooks] = useState([]);
  const [readingChallenge, setReadingChallenge] = useState(null);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    async function fetchUserAndBooks() {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
    
      try {
        // Fetch user profile
        const userResponse = await api.get('/user-profile/', config);
        console.log('User Profile:', userResponse.data);
        setUser(userResponse.data);
    
        // Fetch user's selected books
        const selectedBooksResponse = await api.get('/user-profile/selected_books/', config);
        console.log('Selected Books:', selectedBooksResponse.data);
        setUserSelectedBooks(selectedBooksResponse.data);
    
        // Fetch reading challenge
        const challengeResponse = await api.get('/reading-challenge/', config);
        console.log('Reading Challenge:', challengeResponse.data);
        setReadingChallenge(challengeResponse.data);
    
        // Fetch recommended books
        const recommendedBooksResponse = await api.get('/books/recommendations/', config);
        console.log('Recommended Books:', recommendedBooksResponse.data);
        setRecommendedBooks(recommendedBooksResponse.data);
      } catch (error) {
        console.error('Error fetching user profile and books:', error);
      }
    }
    

    fetchUserAndBooks();
  }, []);

  const handleSelectBook = async (book) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/user-profile/${user.id}/select_book/`, { book_id: book.id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newSelectedBook = response.data;
      setUserSelectedBooks((prevBooks) => [...prevBooks, newSelectedBook]);
      setSuccessMessage('Book successfully selected!');
    } catch (error) {
      console.error('Error selecting book:', error);
    }
  };

  return (
    <div className="userProfile">
      <h3>Your Selected Books:</h3>
      {userSelectedBooks.map((selectedBook) => (
        <div key={selectedBook.id}>
          <h4>{selectedBook.book.title}</h4>
          <p>By {selectedBook.book.author}</p>
        </div>
      ))}

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

      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default UserProfile;
