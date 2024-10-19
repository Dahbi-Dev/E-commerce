import React, { useEffect, useState } from "react";
import { useTheme } from "../Components/ThemeProvider/ThemeProvider"; // Adjust the import path as needed
import './CSS/LoginSignup.css';

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
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const api = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(false);
    };
    loadData();
  }, []);

  const validatePassword = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const mediumRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

    if (strongRegex.test(password)) {
      setPasswordStrength("strong");
    } else if (mediumRegex.test(password)) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("weak");
    }
  };

  const login = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
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
        setError(responseData.errors);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    if (passwordStrength !== "strong") {
      setError("Please use a stronger password");
      return;
    }
    setLoading(true);
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
        setError(responseData.errors);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An error occurred during sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "password") {
      validatePassword(value);
    }
  };

  return (
    <div className={`loginSignup ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="loginSignup-container">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <h1>{state}</h1>
            {error && <div className="error-message">{error}</div>}
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
                <div className="password-field">
                  <input
                    value={formData.password}
                    onChange={changeHandler}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    required
                  />
                  <span
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </div>
                {state === "Sign Up" && (
                  <div className={`password-strength ${passwordStrength}`}>
                    Password strength: {passwordStrength}
                  </div>
                )}
              </div>
              <button type="submit" disabled={loading}>
                {loading ? <Spinner /> : "Continue"}
              </button>
            </form>
            {state === "Sign Up" ? (
              <>
                <p className="loginSignup-login">
                  Already have an account?{" "}
                  <span onClick={() => setState("Login")}>Login here</span>
                </p>
                <div className="loginSignup-agree">
                  <input type="checkbox" name="terms" id="terms" required />
                  <label htmlFor="terms">
                    By continuing, I agree to the terms of use & privacy policy.
                  </label>
                </div>
              </>
            ) : (
              <p className="loginSignup-login">
                Create an account?{" "}
                <span onClick={() => setState("Sign Up")}>Click here</span>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default LoginSignUp;