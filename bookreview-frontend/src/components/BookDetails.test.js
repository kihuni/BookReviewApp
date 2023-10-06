import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import BookDetail from './BookDetails';

jest.mock('axios');

describe('BookDetail', () => {
    it('fetches and displays book details', async () => {
        const mockBook = { id: 1, title: 'Test Book', author: 'Test Author', description: 'Test Description' };
        axios.get.mockResolvedValue({ data: mockBook });

        const { findByText } = render(
            <MemoryRouter initialEntries={['/book/1']}>
                <Routes>
                    <Route path="/book/:id" element={<BookDetail />} />
                </Routes>
            </MemoryRouter>
        );

        expect(await findByText('Test Book')).toBeInTheDocument();
        expect(await findByText('By Test Author')).toBeInTheDocument();
        expect(await findByText('Test Description')).toBeInTheDocument();
    });
});
