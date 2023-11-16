import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from './api';
import '../style.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [readingChallenge, setReadingChallenge] = useState(null);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
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
        setUser(userResponse.data);

        // Fetch user's saved books
        const booksResponse = await api.get('/user-books/', config);
        setUserBooks(booksResponse.data);

        // Fetch reading challenge
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

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('https://www.googleapis.com/books/v1/volumes', {
        params: {
          q: searchQuery,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResults(response.data.items);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBook) {
      console.error('Please select a book from the search results.');
      return;
    }

    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('title', selectedBook.volumeInfo.title);
    formData.append('author', selectedBook.volumeInfo.authors ? selectedBook.volumeInfo.authors.join(', ') : '');
    formData.append('description', selectedBook.volumeInfo.description);
    formData.append('cover_image', selectedBook.volumeInfo.imageLinks?.thumbnail || '');

    try {
      const response = await api.post('/books/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newBook = response.data;
      setSuccessMessage('Book successfully created!');
      setSelectedBook(null);
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

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

      {/* Search functionality */}
      <div>
        <label htmlFor="searchQuery">Search Books:</label>
        <input
          type="text"
          id="searchQuery"
          name="searchQuery"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="button" onClick={handleSearch}>
          Search
        </button>
      </div>
      {searchResults.length > 0 && (
        <div>
          <h3>Search Results:</h3>
          <ul>
            {searchResults.map((book) => (
              <li key={book.id} onClick={() => handleSelectBook(book)}>
                {book.volumeInfo.title} by {book.volumeInfo.authors?.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedBook && (
        <div>
          <h3>Selected Book:</h3>
          <p>Title: {selectedBook.volumeInfo.title}</p>
          <p>Author: {selectedBook.volumeInfo.authors?.join(', ')}</p>
          <p>Description: {selectedBook.volumeInfo.description}</p>
          <button type="button" onClick={handleSubmit}>
            Save Book
          </button>
        </div>
      )}
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default UserProfile;
