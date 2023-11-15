import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import '../style.css';

const BookCreation = ( {user} ) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState(null)
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();


        const token = localStorage.getItem('token');
        const formData = new FormData();

        formData.append('title', title)
        formData.append('author', author)
        formData.append('description', description)
        formData.append('cover_image', coverImage)

        try {

            const response = await api.post('/books/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            
            const newBook = response.data;
            setSuccessMessage('Book successfully created!');
            setTitle('');
            setAuthor('');
            setDescription('');
            setCoverImage(null);
            navigate('/');
        } catch (error) {
            console.error('Error creating book:', error);
        }
        console.log(formData)
    };

    return (
        <div className='bookCreation'>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div>
                    <label htmlFor="cover_image">Cover Image:</label>
                    {coverImage && (
                        <img
                            src={URL.createObjectURL(coverImage)}
                            alt="Preview"
                            style={{ maxWidth: '200px', maxHeight: '200px' }}
                        />
                    )}
                    <input
                        type="file"
                        id="cover_image"
                        name="cover_image"
                        onChange={(e) => setCoverImage(e.target.files[0])}
                    />
                </div>
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
