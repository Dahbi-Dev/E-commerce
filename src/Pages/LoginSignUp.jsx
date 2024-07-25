import React from 'react'
import './CSS/LoginSignup.css'

function LoginSignUp() {
  return (
    <div className='loginSignup'>
      <div className="loginSignup-container">
        <h1>Sign Up</h1>
        <div className="loginSignup-fields">
          <input type="text" placeholder='Your Name' name="" id="" />
          <input type="email" placeholder='Your Email Adress' name="" id="" />
          <input type="password" placeholder='Password' name="" id="" />
        </div>
        <button>Continue</button>
        <p className="loginSignup-login">Already have an account? <span>Login here</span></p>
        <div className="loginSignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignUp