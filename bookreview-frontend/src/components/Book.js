import React from "react";

const Book = ({title, author}) =>{
    return (
        <div date-testid = 'book'>
            <h2>{title}</h2>
            <p>By {author}</p>
        </div>
    )
}

export default Book;