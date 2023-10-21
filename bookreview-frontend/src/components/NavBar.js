import React, { useState } from 'react'; // Ensure to import useState
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ user, setUser }) => {
    const navigate = useNavigate();
    const [menuActive, setMenuActive] = useState(false); // Add this line here

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <div className='container'>
            <div className='header'>
                <nav>
                    <Link className='link home' to="/">BookStation</Link>

                    {/* Hamburger Menu */}
                    <div className="hamburger" onClick={() => setMenuActive(prevState => !prevState)}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>

                    <ul>
                        <Link className='link about' to="/about">About</Link>
                        {user ? (
                            <>
                                <span className='link user-info'>Hi, {user.username}</span>
                                <span className='link user-info'>Email: {user.email}</span>
                                <button className="link logout" onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link className='link create' to="/register">Create Account</Link>
                                <Link className='link login' to="/login">Login</Link>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default NavBar;
