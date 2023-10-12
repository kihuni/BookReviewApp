import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            try {
                const response = await axios.get('http://localhost:8000/user-profile/', config);
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        }

        fetchUser();
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h2>Welcome, {user.username}!</h2>
            <p>Email: {user.email}</p>
            {/* Display user reviews and other details */}
        </div>
    );
}

export default UserProfile;
