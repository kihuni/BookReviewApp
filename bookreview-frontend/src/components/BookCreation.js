import React, { useState } from 'react';
import axios from 'axios';

const BookCreation = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        try {
            await axios.post('http://localhost:8000/books/', {
                title,
                author,
                description
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSuccessMessage('Book successfully created!');
            setTitle('');
            setAuthor('');
            setDescription('');
        } catch (error) {
            console.error('Error creating book:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='title'>Title:</label>
                    <input type='text' id='title' name='title' value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor='author'>Author:</label>
                    <input type='text' id='author' name='author' value={author} onChange={e => setAuthor(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor='description'>Description:</label>
                    <textarea name="description" id="description"  value={description} onChange={e => setDescription(e.target.value)} required />
                </div>
                <button type="submit">Create Book</button>
            </form>
            {successMessage && <p>{successMessage}</p>}
        </div>
    );
}

export default BookCreation;
