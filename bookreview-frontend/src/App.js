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
import axios from 'axios';

function App() {
    const [menuActive, setMenuActive] = useState(false);
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState('light');

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
                const response = await axios.get('https://bookreviewapp.onrender.com/user-profile/', config);
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
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
                        <Route path="/" exact element={<BookList user={user} />} />
                        <Route path="/create" element={<BookCreation user={user} />} />
                        <Route path="/books/edit/:id" element={<BookEdit />} />
                        <Route path="/books/:id" element={<BookDetail />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login fetchUserProfile={fetchUserProfile} setUser={setUser} />} />
                        <Route path="/user-profile" element={<UserProfile />} />
                    </Routes>
                </main>
                <footer></footer>
            </div>
        </Router>
    );
}

export default App;
