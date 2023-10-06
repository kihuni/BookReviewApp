import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" exact element={BookList} />
                <Route path="/book/:id" element={BookDetail} />
            </Routes>
        </Router>
    );
}

export default App;
