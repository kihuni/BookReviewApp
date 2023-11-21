import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from './api';
import UserProfile from './UserProfile'; // Import the UserProfile component

const BookList = ({ user }) => {
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedBookId, setSelectedBookId] = useState(null);

    useEffect(() => {
        console.log('Fetching books...');
        async function fetchBooks() {
            try {
                if (!searchQuery) {
                    // Do not make the request if the query is empty
                    return;
                }

                setLoading(true);
                const response = await api.get('https://www.googleapis.com/books/v1/volumes', {
                    params: {
                        q: searchQuery,
                    },
                });
                setBooks(response.data.items);
            } catch (error) {
                console.error('Error fetching books:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchBooks();
    }, [searchQuery]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleBookSelection = async (bookId) => {
        try {
            const token = localStorage.getItem('token');
            await api.post('/user-profile/selected_books/', { book_id: bookId }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Updated the selectedBookId state
            setSelectedBookId(bookId);
        } catch (error) {
            console.error('Error selecting book:', error);
            // Handle the error
        }
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
                        <div key={book.id} className={`containerList`}>
                            <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} />
                            <h2 className="bookList">
                                <Link to={`/books/${book.id}`}>
                                    <span>Book Title:</span> {book.volumeInfo.title}
                                </Link>
                            </h2>
                            <p className="booklist">
                                <span>By </span>
                                {book.volumeInfo.authors?.join(', ')}
                            </p>
                            <p>{book.volumeInfo.description}</p>
                            <button onClick={() => handleBookSelection(book.id)}>Select Book</button>
                        </div>
                    ))
                )}

                {/* Pass the selectedBookId to the UserProfile component */}
                <UserProfile selectedBookId={selectedBookId} />
            </div>
        </div>
    );
};

export default BookList;
