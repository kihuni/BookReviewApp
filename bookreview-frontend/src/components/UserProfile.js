import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        console.log("Fetching data for UserProfile");
        async function fetchUser() {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            try {
                const response = await axios.get('http://localhost:8000/user-profile/', config);
                console.log(response.data)
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
        </div>
    );
}

export default UserProfile;
