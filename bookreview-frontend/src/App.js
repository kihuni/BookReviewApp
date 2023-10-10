import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom'
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import BookCreation from './components/BookCreation';
import BookEdit from './components/BookEdit';

function App() {
    return (
        <Router>
            <div className='App'>
                <header>
                    <h1>Welcome to the Book Review App</h1>
                    <nav>
                        <Link to="/">Home</Link>
                        <Link to="/create">Create Book</Link>
                    </nav>
                </header>

                <main>
                    <Routes>
                        <Route path="/" exact element={<BookList />} />
                        <Route path="/books/:id" element={<BookDetail />} />
                        <Route path="/books/edit/:id" element={<BookEdit />} />
                        <Route path="/create" element={<BookCreation />} />
                    </Routes>
                </main>
                <footer></footer>
            </div>
        </Router>
    );
}

export default App;
