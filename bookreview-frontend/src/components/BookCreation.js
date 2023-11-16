import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import '../style.css';

const BookCreation = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await api.get('https://www.googleapis.com/books/v1/volumes', {
        params: {
          q: searchQuery,
        },
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
      navigate('/');
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  return (
    <div className="bookCreation">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
          </div>
        )}
      </form>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default BookCreation;
