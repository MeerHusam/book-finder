import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// import "./loginform.css";

function LoginForm() {
  const navigate = useNavigate(); // Hook from react-router-dom
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!response.ok) {
        throw response;
      }

      const data = await response.json();
      setMessage(data.message);
      setError("");
      navigate("/"); // Redirects to main page (Home page) after successful login.
    } catch (err) {
      console.log(err);
      if (err instanceof Response) {
        err.text().then((text) => {
          if (text) {
            const errorData = JSON.parse(text);
            setError(errorData.error);
          } else {
            setError("An error occurred.");
          }
        });
      } else {
        setError("An error occurred while logging in.");
      }
      setMessage("");
    }
  };

  return (
    <div>
      <h2> LoginForm</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default LoginForm;
