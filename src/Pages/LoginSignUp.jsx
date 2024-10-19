import React, { useState, useEffect } from "react";
import "./CSS/LoginSignup.css";
import { useTheme } from '../Components/ThemeProvider/ThemeProvider';

const Spinner = () => (
  <div className="spinner">
    <div className="spinner-border" role="status">
      <span className="sr-only"></span>
    </div>
  </div>
);

function SignUp() {
  const { isDarkMode } = useTheme();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const api = process.env.REACT_APP_API_URL;

  const validateInput = () => {
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Invalid email format");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    return true;
  };

  const signUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateInput()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${api}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (responseData.success) {
        localStorage.setItem("auth-token", responseData.token);
        window.location.replace("/");
      } else {
        setError(Array.isArray(responseData.errors) 
          ? responseData.errors[0].msg 
          : responseData.errors);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={`signup ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="signup-container">
        <h1>Sign Up</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={signUp}>
          <div className="signup-fields">
            <input
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder="Your Name"
              name="username"
              required
            />
            <input
              value={formData.email}
              onChange={changeHandler}
              type="email"
              placeholder="Your Email Address"
              name="email"
              required
            />
            <input
              value={formData.password}
              onChange={changeHandler}
              type="password"
              placeholder="Password"
              name="password"
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? <Spinner /> : "Sign Up"}
          </button>
        </form>
        <p className="signup-login">
          Already have an account? <span onClick={() => {/* Handle login state change */}}>Login here</span>
        </p>
        <div className="signup-agree">
          <input type="checkbox" name="terms" id="terms" required />
          <label htmlFor="terms">By continuing, I agree to the terms of use & privacy policy.</label>
        </div>
      </div>
    </div>
  );
}

export default SignUp;