import React, { useState } from 'react';
import '../style.css';
import api from './api';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Login = ({ fetchUserProfile, setUser }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/login/', {
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

    const responseGoogle = async (response) => {
        try {
            const googleResponse = await api.post('/google-login/', {
                id_token: response.tokenId,
            });

            localStorage.setItem('token', googleResponse.data.token);
            await fetchUserProfile();
            navigate('/user-profile');
        } catch (err) {
            setError('Google Sign-In failed. Please try again.');
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
            <GoogleOAuthProvider clientId="333808842220-evonajk2k4m9nog5gblei5e19hh1b8r7.apps.googleusercontent.com">
                <GoogleLogin onSuccess={responseGoogle} onFailure={responseGoogle} />
            </GoogleOAuthProvider>
        </div>
    );
}

export default Login;
