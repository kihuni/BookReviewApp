import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style.css'
import api from './api';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [userBooks, setUserBooks] = useState([]); 

    useEffect(() => {
        async function fetchUserAndBooks() {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            try {
                const userResponse = await api.get('/user-profile/', config);
                setUser(userResponse.data);

                const booksResponse = await api.get('/user-books/', config);
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
