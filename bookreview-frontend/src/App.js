import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import BookCreation from './components/BookCreation';
import BookEdit from './components/BookEdit';
import About from './components/about';
import './style.css';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import Register from './components/Register';
import NavBar from './components/NavBar'; 
import api from './components/api';

function App() {
    console.log('Rendering App component');
    const [menuActive, setMenuActive] = useState(false);
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState('light');
    const [selectedBookId, setSelectedBookId] = useState(null);

    const handleBookSelection = (bookId) => {
        setSelectedBookId(bookId);
    };

    useEffect(() => {
        document.body.dataset.theme = theme;
        if (menuActive) {
            document.body.classList.add("menu-active");
        } else {
            document.body.classList.remove("menu-active");
        }
    }, [menuActive, theme]);

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            try {
                const response = await api.get('/user-profile/', config);
                console.log('User Profile Response:', response.data); // for debbugging
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
                console.log('Error response:', error.response);
            }
        }
    }

    useEffect(() => {
        fetchUserProfile();
    }, []);

    return (
        <Router>
            <NavBar user={user} setTheme={setTheme} theme={theme} setUser={setUser} />
            <div className='App'>
                <main>
                    <Routes>
                        <Route
                            path="/"
                            element={<BookList user={user} selectedBookId={selectedBookId} onBookSelect={handleBookSelection} />}
                        />
                        <Route path="/create" element={<BookCreation user={user} />} />
                        <Route path="/books/edit/:id" element={<BookEdit />} />
                        <Route path="/books/:id" element={<BookDetail />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login fetchUserProfile={fetchUserProfile} setUser={setUser} />} />
                        {/* Pass selectedBookId to the UserProfile component */}
                        <Route
                            path="/user-profile"
                            element={<UserProfile selectedBookId={selectedBookId} />}
                        />
                    </Routes>
                </main>
                <footer></footer>
            </div>
        </Router>
    );
}

export default App;