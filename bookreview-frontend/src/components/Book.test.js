import React from "react";
import {render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Book from "./Book";

test('it display a book', ()=>{
    const {getByText, getByTestId } = render(<Book title="Miracles" author="Kihuni" />);

    // Checkin if the book element is in the document
    expect(getByTestId('book')).toBeTheDocument();

    // Checking if title and author are correctly rendered
    expect(getByText('Miracles')).toBeTheDocument();
    expect(getByText('By Kihuni')).toBeTheDocument();
}); 