// signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ✨ 1. Import your new CSS file
import './signup.css';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      if (response.ok) {
        alert("Sign-up successful! Please sign in.");
        navigate('/signin');
      } else {
        alert("Failed to sign up. Please try again.");
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      alert("An error occurred during sign-up.");
    }
  };

  return (
    // ✨ 2. The <style> tag is now removed
    <div className="login-container">
      {/* Left Section */}
      <div className="left-section">
        <div className="logo">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5V14h-2V9.5h2V12h1.5c1.45 0 2.625-1.18 2.625-2.625S14.95 6.75 13.5 6.75h-3c-1.1 0-2 .9-2 2v8h1.5v-3.5h1V12h1.5c.58 0 1.05.47 1.05 1.05s-.47 1.05-1.05 1.05h-1.5v3.5h-1V17.5zm5.5-2.5V14h-1V9.5h1V12h1.5c1.45 0 2.625-1.18 2.625-2.625S19.95 6.75 18.5 6.75h-3c-1.1 0-2 .9-2 2v8h1.5v-3.5h1V12h1.5c.58 0 1.05.47 1.05 1.05s-.47 1.05-1.05 1.05h-1.5z"/></svg>
          Fin<span className="highlight">Wise</span>
        </div>
        <img src="https://i.ibb.co/RNcxZxH/planet-character.png" alt="Illustration" className="illustration" />
        <h2>Join us to start your <br /> <span className="highlight">financial journey</span></h2>
        <p>Take the first step towards financial clarity.</p>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <div className="form-box">
          <h2>Create Account</h2>

          <label>Full name</label>
          <input 
            type="text" 
            placeholder="Your Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
            placeholder="Create a strong password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleSignUp} className="signin-btn">Sign Up</button>
          
          <p className="signup-link">
            Already have an account?{" "}
            <Link to="/signin">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}