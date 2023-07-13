import React from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  let navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "GET",
        credentials: "include", // Needed to include the session cookie
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // If you need to clear any user info from your app state, do so here
      // For example, this could involve calling a logout action in Redux
      // This line reads the response body as JSON
      const data = await response.json();

      // Log out the message or handle it as needed
      console.log(data.message);

      // Then, redirect to login page
      navigate("/loginform");
    } catch (error) {
      // Handle or display error as needed
      console.error("Logout error", error);
    }
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default Logout;
