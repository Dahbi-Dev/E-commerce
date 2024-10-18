import React, { useEffect, useState } from "react";
import "./CSS/LoginSignup.css";
import { useTheme } from '../Components/ThemeProvider/ThemeProvider'; // Adjust the import path as needed


// Spinner Component
const Spinner = () => (
  <div className="spinner">
    <div className="spinner-border" role="status">
      <span className="sr-only"></span>
    </div>
  </div>
);

function LoginSignUp() {
  const { isDarkMode } = useTheme();
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [loading, setLoading] = useState(true); // Loading state
  const api = process.env.REACT_APP_API_URL


  // Effect to simulate initial loading
  useEffect(() => {
    const loadData = async () => {
      // Simulating an API call or fetching initial data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate a 500ms delay
      setLoading(false); // Stop loading after the simulated delay
    };

    loadData();
  }, []); // Runs once when component mounts

  const login = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true); // Start loading for API request
    console.log("Login Function", formData);
    let responseData;

    try {
      const response = await fetch(`${api}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      responseData = await response.json();

      if (responseData.success) {
        localStorage.setItem("auth-token", responseData.token);
        window.location.replace("/");
      } else {
        alert(responseData.errors);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!formData.username || !formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true); // Start loading for API request
    console.log("Sign Up Function", formData);
    let responseData;

    try {
      const response = await fetch(`${api}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      responseData = await response.json();

      if (responseData.success) {
        localStorage.setItem("auth-token", responseData.token);
        window.location.replace("/");
      } else {
        alert(responseData.errors);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={`loginSignup ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="loginSignup-container">
        {loading ? ( // Show loading spinner on initial load
          <Spinner />
        ) : (
          <>
            <h1>{state}</h1>
            <form onSubmit={state === "Login" ? login : signUp}>
              <div className="loginSignup-fields">
                {state === "Sign Up" && (
                  <input
                    value={formData.username}
                    onChange={changeHandler}
                    type="text"
                    placeholder="Your Name"
                    name="username"
                    required
                  />
                )}
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
              <button type="submit">
                {loading ? <Spinner /> : "Continue"}
              </button>
            </form>
            {state === "Sign Up" ? (
              <>
                <p className="loginSignup-login">
                  Already have an account?{" "}
                  <span
                    onClick={() => {
                      setState("Login");
                    }}
                  >
                    Login here
                  </span>
                </p>
                <div className="loginSignup-agree">
                  <input type="checkbox" name="terms" id="terms" required />
                  <label htmlFor="terms">By continuing, I agree to the terms of use & privacy policy.</label>
                </div>
              </>
            ) : (
              <p className="loginSignup-login">
                Create an account?{" "}
                <span
                  onClick={() => {
                    setState("Sign Up");
                  }}
                >
                  Click here
                </span>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default LoginSignUp;