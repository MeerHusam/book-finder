import React from "react";
import { useState, useEffect } from "react";
import "./HomePage.css";
import Books from "./Books";
import Pagination from "./Pagination";
import wishListIcon from "../images/wishList.png";

const API_URL = `https://www.googleapis.com/books/v1/volumes?key=AIzaSyAtptaosmrZ_5w_myuJygztCCpQBnGjMVA`;

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10);
  const [wishListNumber, setWishListNumber] = useState(0);

  const handleAddToWishlist = () => {
    setWishListNumber(wishListNumber + 1);
  };

  const searchBooks = async (query) => {
    setLoading(true);
    const response = await fetch(`${API_URL}&q=${query}&maxResults=40`);
    const data = await response.json();
    if (data.items) {
      setBooks(data.items);
    }
    setLoading(false);
  };

  useEffect(() => {
    searchBooks(searchTerm);
  }, [searchTerm]);

  // Calculate total pages
  const totalPages = Math.ceil(books.length / booksPerPage);

  // Get current books for the current page
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container">
      <h1 className="pageTitle">Book Finder</h1>
      <div>
        <img src={wishListIcon} alt="WishList" className="top-right-image" />

        <span className="wishlist-number">{wishListNumber}</span>
      </div>

      <div className="search">
        <input
          placeholder="Search for the book"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="results">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {currentBooks.length > 0 ? (
              <>
                <Books
                  books={currentBooks}
                  addToWishlist={handleAddToWishlist}
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <p>No results found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
