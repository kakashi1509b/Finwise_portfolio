// signin.jsx - Final Corrected Version

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Make sure the CSS file is imported
import './signin.css';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
  console.log('Sign-in successful');
  
  // This line seems to be for storing the user's email, which is fine.
  window.sessionStorage.setItem('admin', email); 

  // Change this line from '/'
  // navigate('/'); 

  // To '/dashboard'
  navigate('/dashboard'); // ✅ This will redirect to your dashboard page
} else {
  alert('Invalid Credentials');
}
    } catch (error) {
      console.error('Sign-in error:', error);
      alert("An error occurred during sign-in.");
    }
  };

  return (
    <div className="login-container">
      {/* Left Section */}
      <div className="left-section">
        <div className="logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5V14h-2V9.5h2V12h1.5c1.45 0 2.625-1.18 2.625-2.625S14.95 6.75 13.5 6.75h-3c-1.1 0-2 .9-2 2v8h1.5v-3.5h1V12h1.5c.58 0 1.05.47 1.05 1.05s-.47 1.05-1.05 1.05h-1.5v3.5h-1V17.5zm5.5-2.5V14h-1V9.5h1V12h1.5c1.45 0 2.625-1.18 2.625-2.625S19.95 6.75 18.5 6.75h-3c-1.1 0-2 .9-2 2v8h1.5v-3.5h1V12h1.5c.58 0 1.05.47 1.05 1.05s-.47 1.05-1.05 1.05h-1.5z"/></svg>
          Fin<span className="highlight">Wise</span>
        </div>
        <img src="https://i.ibb.co/RNcxZxH/planet-character.png" alt="Illustration" className="illustration" />
        <h2>Sign in to your <br /> <span className="highlight">financial journey</span></h2>
        <p>Get back control — one step at a time.</p>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <div className="form-box">
          <h2>Sign In</h2>

          <label>Email address</label>
          <input 
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input 
            type="password" 
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button onClick={handleSignIn} className="signin-btn">Sign In</button>
          
          <p className="or-text">Or continue with</p>
          <div className="social-buttons">
            <button className="google-btn">Google</button>
            <button className="facebook-btn">Facebook</button>
          </div>
          
          <p className="signup-link">
              Don't have an account?{" "}
              <Link to="/signup">Sign up now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}