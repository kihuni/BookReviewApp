import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../style.css'

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [userBooks, setUserBooks] = useState([]); // To store the books

    useEffect(() => {
        async function fetchUserAndBooks() {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            try {
                const userResponse = await axios.get('http://localhost:8000/user-profile/', config);
                setUser(userResponse.data);

                const booksResponse = await axios.get('http://localhost:8000/user-books/', config);
                setUserBooks(booksResponse.data);
                
            } catch (error) {
                console.error("Error fetching user profile and books:", error);
            }
        }

        fetchUserAndBooks();
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div className='userProfile'>
            <h3>Your Books:</h3>
            {userBooks.map(book => (
                <div key={book.id}>
                    <h4>{book.title}</h4>
                    <p>By {book.author}</p>
                    <Link to={`/books/edit/${book.id}`}>Edit</Link>
                </div>
            ))}

            <Link to="/create">Create New Book</Link>
        </div>
    );
}

export default UserProfile;
