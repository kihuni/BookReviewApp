import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style.css'
import api from './api';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmedPassword:'',
        first_name: '',
        last_name: ''
    });
    const navigate = useNavigate()
    const [message, setMessage] = useState('');
    const [isInvalidPassword, setIsInvalidPassword] = useState(false);


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    const isStrongPassword = (password) => {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasDigit = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return password.length >= 8 && hasUppercase && hasLowercase && hasDigit && hasSpecialChar;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

       
    if (formData.password !== formData.confirmedPassword) {
        setMessage("Passwords do not match.");
        return;
    }

    if (!isStrongPassword(formData.password)) {
        setMessage("Password must meet the requirements: At least 8 characters, 1 uppercase, 1 lowercase, 1 digit, and 1 special character.");
        setIsInvalidPassword(true); 
        return;
    } else {
        setIsInvalidPassword(false); 
    }

        const { confirmedPassword, ...submitData } = formData;
        try {
            const response = await api.post('https://bookreviewapp.onrender.com/register/', submitData);
            setMessage('Registration successful!');
            navigate('/login')
        } catch (error) {
            setMessage('Error during registration. Please try again.');
        }
    }

    return (
        <div className='headerLogin'>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange}
                    required
                    style={isInvalidPassword ? { borderColor: 'red' } : {}}
                     />
                    <small>Password should be at least 8 characters, have an uppercase, a lowercase, a digit, and a special character.</small>
                </div>
                <div>
                    <label htmlFor="confirmedPassword">Confirm Password</label>
                    <input type="password" id="confirmedPassword" name="confirmedPassword" value={formData.confirmedPassword} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="first_name">First Name</label>
                    <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="last_name">Last Name</label>
                    <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} />
                </div>
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Register;
