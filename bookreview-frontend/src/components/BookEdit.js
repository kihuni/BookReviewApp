import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function BookEdit() {
    const { id } = useParams();

    const [book, setBook] = useState({
        title: '',
        author: '',
        description: ''
    });

    useEffect(() => {
        // Fetch the current data of the book
        async function fetchBook() {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/books/${id}/`);
                setBook(response.data);
            } catch (error) {
                console.error("Error fetching book data:", error);
            }
        }

        fetchBook();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setBook(prevState => ({ ...prevState, [name]: value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`http://127.0.0.1:8000/books/${id}/`, book);
            // Redirect to the book details page or some confirmation page after successful update
        } catch (error) {
            console.error("Error updating book:", error);
        }
    }

    return (
        <div>
            <h2>Edit Book</h2>
            <form onSubmit={handleSubmit}>
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
