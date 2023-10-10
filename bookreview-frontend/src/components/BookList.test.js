import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import BookList from './BookList';

// Mock axios.get function
jest.mock('axios');

describe('BookList', () => {
    it('fetches and displays books', async () => {
        // Define the mock data
        const books = [
            { id: 1, title: 'Book 1', author: 'Author 1' },
            { id: 2, title: 'Book 2', author: 'Author 2' }
        ];

        // Mock the axios.get promise to resolve with mock data
        axios.get.mockResolvedValue({ data: books });

        // Render the BookList component
        const { findByText } = render(<BookList />);

        // Wait for the component to fetch data and update the state
        expect(await findByText('Book 1')).toBeInTheDocument();
        expect(await findByText('By Author 1')).toBeInTheDocument();
        expect(await findByText('Book 2')).toBeInTheDocument();
        expect(await findByText('By Author 2')).toBeInTheDocument();
    });
});
