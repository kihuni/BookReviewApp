import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/books" exact element={<BookList />} />
                    <Route path="/books/:id" element={<BookDetail />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
