import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../style.css'

function BookEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState({
        title: '',
        author: '',
        description: ''
    });
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const config ={
            headers: { Authorization: `Bearer ${token}`}
        }

        // Fetch the current data of the book
        async function fetchBook() {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/books/${id}/`, config);
                setBook(response.data);
                setCoverImageUrl(`http://127.0.0.1:8000${response.data.cover_image}`);
            } catch (error) {
                console.error("Error fetching book data:", error);
            }
        }

        fetchBook();
    }, [id]);

    // This function updates the book state
    const handleChange = (event) => {
        const { name, value } = event.target;
        setBook(prevState => ({ ...prevState, [name]: value }));
    }

    // This updates the book data in the backend when the form is submitted
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const token = localStorage.getItem('token');
        const config ={
            headers: { Authorization: `Bearer ${token}`}
        };
    
        const formData = new FormData();
        formData.append('title', book.title);
        formData.append('author', book.author);
        formData.append('description', book.description);
        if (coverImage) {
            formData.append('cover_image', coverImage);
        }
       
        try {
            await axios.put(`http://127.0.0.1:8000/books/${id}/`, formData, config);
            // Redirect to the book details page
            navigate(`/books/${id}`)
        } catch (error) {
            console.error("Error updating book:", error);
        }
    };
    

    return (
        <div className='bookedit'>
            <h2>Edit Book</h2>
            <form onSubmit={handleSubmit}>
             <div>
                    <label htmlFor="cover_image">Cover Image:</label>
                    {coverImageUrl && <img src={coverImageUrl} alt="Book cover" />}
                    <input 
                        type="file" 
                        id="cover_image" 
                        name="cover_image" 
                        onChange={e => setCoverImage(e.target.files[0])} 
                    />
               </div>

                <div>
                    <label htmlFor="title">Title:</label>
                    <input 
                        type="text" 
                        id="title" 
                        name="title" 
                        value={book.title} 
                        onChange={handleChange} 
                    />
                </div>
                <div>
                    <label htmlFor="author">Author:</label>
                    <input 
                        type="text" 
                        id="author" 
                        name="author" 
                        value={book.author} 
                        onChange={handleChange} 
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea 
                        id="description" 
                        name="description" 
                        value={book.description} 
                        onChange={handleChange}
                    ></textarea>
                </div>
                <button type="submit">Update Book</button>
            </form>
        </div>
    );
}

export default BookEdit;
