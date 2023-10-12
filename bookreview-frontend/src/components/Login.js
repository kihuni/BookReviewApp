import React, { useState } from 'react';
import axios from 'axios';
import '../style.css'

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api-token-auth/', {
                username,
                password
            });

            localStorage.setItem('token', response.data.token); // The token is saved to local storage
            window.location.reload(); // or navigate the user to another page
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
