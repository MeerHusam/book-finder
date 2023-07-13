import React from "react";
// import Register from "./components/Register";
// import LoginForm from "./components/loginform";
import LogoutButton from "./Logout"; // assuming this is the correct path
import "./navbar.css";

export default function Navbar() {
  return (
    <nav className="nav">
      <a href="./" className="book-finder">
        Book Finder
      </a>
      <ul>
        <li>
          <a href="./Register">Register</a>
        </li>
        <li>
          <a href="./loginform">LoginForm</a>
        </li>
        <li>
          <LogoutButton />
        </li>
      </ul>
    </nav>
  );
}
