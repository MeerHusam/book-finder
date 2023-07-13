import React from "react";
import { useState } from "react";

const Books = ({ books, loading, addToWishlist }) => {
  const [wishListID, setWishListID] = useState([]);
  if (loading) {
    return <h2>Loading...</h2>;
  }

  const handleAddToWishlist = (bookID) => {
    // Send the book ID to the backend
    fetch("http://localhost:5000/wishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: bookID }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => {
        console.error("Error:", error);
      });

    // Adding book in the wishlist icon
    if (!wishListID.includes(bookID)) {
      setWishListID(bookID);
      addToWishlist(bookID);
    }
  };

  return (
    <ul className="list-group mb-4 list-group-width">
      {books.map((book) => (
        <li key={book.id} className="list-group-item">
          <a
            className="book-link"
            href={book.volumeInfo.previewLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3>{book.volumeInfo.title}</h3>
          </a>

          <p>Authors: {book.volumeInfo.authors?.join(", ")}</p>
          {book.volumeInfo.imageLinks &&
          book.volumeInfo.imageLinks.thumbnail ? (
            <img
              src={book.volumeInfo.imageLinks.thumbnail}
              alt={book.volumeInfo.title}
            />
          ) : (
            <p>No thumbnail available</p>
          )}

          {/* Add the wishlist button */}
          <button onClick={() => handleAddToWishlist(book.id)}>
            Add to Wishlist
          </button>
        </li>
      ))}
    </ul>
  );
};

export default Books;
