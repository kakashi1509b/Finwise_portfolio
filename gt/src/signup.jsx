import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState('');
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
        body: JSON.stringify({ username, password })
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
    <>
      <style>{`
        .login-container {
          display: flex;
          height: 100vh;
          font-family: 'Inter', sans-serif;
          background-color: #f8f9fa;
        }
        .left-section {
          flex: 1;
          background-color: #1a1a1a;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 4rem;
          text-align: center;
        }
        .logo {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 2rem;
        }
        .logo .highlight {
          color: #4CAF50;
        }
        .illustration {
          max-width: 300px;
          margin: 2rem 0;
        }
        .left-section h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        .left-section .highlight {
          color: #4CAF50;
        }
        .left-section p {
          color: #ccc;
          max-width: 350px;
        }
        .right-section {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .form-box {
          width: 100%;
          max-width: 400px;
          padding: 3rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .form-box h2 {
          font-size: 2rem;
          margin-bottom: 2rem;
          text-align: center;
          color: #333;
        }
        .form-box label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #555;
        }
        .form-box input {
          width: 100%;
          padding: 1rem;
          margin-bottom: 1.5rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        .form-box input:focus {
          outline: none;
          border-color: #4CAF50;
        }
        .signin-btn {
          width: 100%;
          padding: 1rem;
          border: none;
          border-radius: 8px;
          background-color: #4CAF50;
          color: white;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .signin-btn:hover {
          background-color: #45a049;
        }
        .signup-link {
          margin-top: 1.5rem;
          text-align: center;
          color: #555;
        }
        .signup-link a {
          color: #4CAF50;
          font-weight: 600;
          text-decoration: none;
        }
        .signup-link a:hover {
          text-decoration: underline;
        }
         .logo svg {
            display: none; /* Hiding the complex SVG for a cleaner look */
        }
      `}</style>
      <div className="login-container">
        <div className="left-section">
          <div className="logo">
            Fin<span className="highlight">Wise</span>
          </div>
          <img src="https://i.ibb.co/RNcxZxH/planet-character.png" alt="Illustration" className="illustration" />
          <h2>Join us to start your <br /> <span className="highlight">financial journey</span></h2>
          <p>Take the first step towards financial clarity.</p>
        </div>

        <div className="right-section">
          <div className="form-box">
            <h2>Create Account</h2>

            <label>Email address</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
    </>
  );
}

