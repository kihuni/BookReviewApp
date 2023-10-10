import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import BookCreation from './BookCreation';

jest.mock('axios');

describe('BookCreation', () => {
    it('creates a book when the form is submitted', async () => {
        axios.post.mockResolvedValue({ data: {} });

        render(<BookCreation />);

        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Book' } });
        fireEvent.change(screen.getByLabelText(/author/i), { target: { value: 'Test Author' } });
        fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Description' } });

        fireEvent.click(screen.getByText(/create book/i));

        // Assuming you have some kind of loading or success feedback mechanism
        expect(await screen.findByText('Book successfully created!')).toBeInTheDocument();
    });
});
