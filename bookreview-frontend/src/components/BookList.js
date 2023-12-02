import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from './api';
import UserProfile from './UserProfile';
import { useLocation } from 'react-router-dom';


const BookList = ({ user }) => {
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const location = useLocation();

    useEffect(() => {
        console.log('Fetching books...');
        console.log('User prop in BookList:', user);
        async function fetchBooks() {
            try {
                if (!searchQuery) {
                    // Do not make the request if the query is empty
                    return;
                }

                setLoading(true);
                const response = await api.get('/books/search/', {
                    params: {
                        q: searchQuery,
                    },
                });
                setBooks(response.data);
            } catch (error) {
                console.error('Error fetching books:', error);

                    // Log more details about the error
                if (error.response) {
                    console.error('Error response from server:', error.response.data);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error setting up the request:', error.message);
                }

                // Display a user-friendly error message
                setError('Failed to fetch books. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchBooks();
    }, [searchQuery]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div>
            <div className="ListHeader">
                <div>
                    <div className="inlineDiv"></div>
                    <h2>Meet your <span>Next</span> favorite Book</h2>
                    <p>From your favorite <span>Author</span></p>
                    <input
                        type="text"
                        placeholder="Search books"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
            </div>

            <div className="headerList">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    books.map((book) => (
                        <div key={book.title} className={`containerList`}>
                            <img src={book.cover_image} alt={book.title} />
                            <h2 className="bookList">
                                <Link to={`/books/${book.id}`}>
                                    <span>Book Title:</span> {book.title}
                                </Link>
                            </h2>
                            <p className="booklist">
                                <span>By </span>
                                {book.author}
                            </p>
                            <p>{book.description}</p>
                        </div>
                    ))
                )}

                {/* Render UserProfile only if the user is logged in */}
                {user && location.pathname === '/user-profile' && <UserProfile />}
            </div>
        </div>
    );
};

export default BookList;