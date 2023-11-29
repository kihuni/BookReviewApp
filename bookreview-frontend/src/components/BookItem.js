import React from 'react';

const BookItem = ({ selectedBook }) => {
  if (!selectedBook || !selectedBook.book) {
    return <p>Error: Invalid book data</p>;
  }

  const { book } = selectedBook;

  return (
    <div className={`containerList`}>
      {book.cover_image && <img src={book.cover_image} alt={book.title} />}
      <h2 className="bookList">
        <span>Book Title:</span> {book.title}
      </h2>
      <p className="booklist">
        <span>By </span>
        {book.author}
      </p>
      <p>{book.description}</p>
    </div>
  );
};

export default BookItem;
