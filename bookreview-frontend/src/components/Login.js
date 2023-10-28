import React, { useState } from 'react';
import '../style.css';
import api from './api';
import { useNavigate } from 'react-router-dom';

const Login = ({ fetchUserProfile, setUser }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('https://bookreviewapp.onrender.com/login/', {
                username,
                password
            });

            localStorage.setItem('token', response.data.token); // Save the token to local storage
            await fetchUserProfile();  // Fetch the user profile
            navigate('/user-profile'); // Navigate to the user profile page
        } catch (err) {
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className='headerLogin'>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    type="text"
                    placeholder="Username"
                    required
                />
                <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
