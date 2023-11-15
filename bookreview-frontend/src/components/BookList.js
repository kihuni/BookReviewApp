import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style.css';
import api from './api';

const BookList = ({ user }) => {
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBooks() {
            try {
                setLoading(true);
                const response = await api.get('https://www.googleapis.com/books/v1/volumes', {
                    params: {
                        q: searchQuery,
                    },
                });
                setBooks(response.data.items); // Update to use items from the response
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
                        <div
                            key={book.id}
                            className={`containerList`}
                        >
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
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BookList;
