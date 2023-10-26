import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
            await axios.post('https://bookreviewapp.onrender.com/', formData, {
    
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccessMessage('Book successfully created!');
            setTitle('');
            setAuthor('');
            setDescription('');
            setCoverImage(null); 
            navigate('/')
        } catch (error) {
            console.error('Error creating book:', error);
        }
    };

    return (
        <div className='bookCreation'>
            <form onSubmit={handleSubmit}>
              <div>
                    <label htmlFor='cover_image'>Cover Image:</label>
                    <input type='file' id='cover_image' name='cover_image' onChange={e => setCoverImage(e.target.files[0])} />
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
