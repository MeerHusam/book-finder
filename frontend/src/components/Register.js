import React, { useState } from "react";

// import "./Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();

    // form validation checks here
    if (!username || !password || !confirmation || password !== confirmation) {
      setError("Please enter valid credentials and make sure passwords match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, confirmation }),
      });

      if (!response.ok) {
        throw response;
      }

      const data = await response.json();
      setMessage(data.message);
      setError("");
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
        setError("An error occurred while registering.");
      }
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
        <label>
          Confirm Password:
          <input
            type="password"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Register;
