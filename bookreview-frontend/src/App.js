import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom'
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import BookCreation from './components/BookCreation';
import BookEdit from './components/BookEdit';
import About from './components/about'
import './style.css'

function App() {
    return (
        <Router>
            <div className='App'>
                <div className='header'>
                    <nav>
                        <Link className=' link home' to="/">BookStation</Link>
                        <ul>
                            <Link className='link about' to="/about">About</Link>
                            <Link className='link create' to="">Create Account</Link>
                            <Link className='link login' to="">Login</Link>
                        </ul>
                    </nav>
                </div>

                <main>
                    <Routes>
                        <Route path="/" exact element={<BookList />} />
                        <Route path="/create" element={<BookCreation />} />
                        <Route path="/books/edit/:id" element={<BookEdit />} />
                        <Route path="/books/:id" element={<BookDetail />} />
                        <Route path="/about" element={<About />} />
                    </Routes>
                </main>
                <footer></footer>
            </div>
        </Router>
    );
}

export default App;
