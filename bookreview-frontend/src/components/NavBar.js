import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';


const NavBar = ({ user, setUser, theme, setTheme }) => {
    const navigate = useNavigate();
    const [menuActive, setMenuActive] = useState(false);

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
                    <div className="hamburger" onClick={() => setMenuActive(prevState => !prevState) }>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>

                    <ul className={menuActive ? 'active' : ''}>
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

                        <button className="theme-toggle" onClick={() => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')}>
                            {theme === 'light' ? 
                                <i className="fa fa-moon-o" aria-hidden="true"></i> :
                                <i className="fa fa-sun-o" aria-hidden="true"></i>
                            }
                         </button>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default NavBar;
