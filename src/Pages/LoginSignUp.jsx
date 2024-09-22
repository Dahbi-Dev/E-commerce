import React from "react";
import "./CSS/LoginSignup.css";
import { useState } from "react";

function LoginSignUp() {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const login = async () => {
    console.log("Login Function", formData);
    let responseData;
    await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        Accept: "application/form/data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem("auth-token", responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  };

  const signUp = async () => {
    console.log("Sign Up Function", formData);
    let responseData;
    await fetch("http://localhost:4000/signup", {
      method: "POST",
      headers: {
        Accept: "application/form/data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem("auth-token", responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  };

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="loginSignup">
      <div className="loginSignup-container">
        <h1>{state}</h1>
        <div className="loginSignup-fields">
          {state === "Sign Up" ? (
            <input
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder="Your Name"
              name="username"
              id=""
            />
          ) : (
            <></>
          )}
          <input
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Your Email Adress"
            name="email"
            id=""
          />
          <input
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
            name="password"
            id=""
          />
        </div>
        <button
          onClick={() => {
            state === "Login" ? login() : signUp();
          }}
        >
          Continue
        </button>
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
              <input type="checkbox" name="" id="" />
              <p>
                By continuing, i agree to the terms of use & privacy policy.
              </p>
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
      </div>
    </div>
  );
}

export default LoginSignUp;
