import axios from 'axios/index.js';
import { getBooks } from './api';

// Mocking Axios module
jest.mock('axios');

describe('getBooks', () => {
    it('fetches successfully data from an API', async () => {
        const data = [
            { title: 'Book 1', author: 'Author 1' },
            { title: 'Book 2', author: 'Author 2' }
        ];

        // Mocking the axios.get function to resolve with 'data'
        axios.get.mockResolvedValue({ data });

        const result = await getBooks();

        expect(result.data).toEqual(data);
    });

    it('fetches erroneously data from an API', async () => {
        const errorMessage = 'Error fetching data';

        // Mocking the axios.get function to reject
        axios.get.mockRejectedValue(new Error(errorMessage));

        await expect(getBooks()).rejects.toThrow(errorMessage);
    });
});
