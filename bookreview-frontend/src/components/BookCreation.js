import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const BookCreation = ({ user }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleImgBBUpload = async () => {
    return new Promise((resolve, reject) => {
      // Trigger the ImgBB upload plugin
      window.openImgBBUploader({
        apiKey: process.env.REACT_APP_IMGBB_API_KEY,
        onSuccess: (result) => {
          const imgbbImageUrl = result.url;
          resolve(imgbbImageUrl);
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    try {
      // Upload the cover image to ImgBB using the ImgBB plugin
      const imgbbImageUrl = await handleImgBBUpload();

      // Use the ImgBB image URL for the book cover image
      await api.post(
        '/books/',
        {
          title,
          author,
          description,
          cover_image: imgbbImageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage('Book successfully created!');
      setTitle('');
      setAuthor('');
      setDescription('');
      navigate('/');
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  return (
    <div className="bookCreation">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <button type="button" onClick={handleImgBBUpload}>
            Upload Cover Image
          </button>
        </div>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Book</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default BookCreation;
