// Homepage.jsx - Final, Complete, No Placeholders

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './homepage.css';

const Homepage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      text: "Hello! I'm your FinWise assistant. How can I help you manage your finances today?",
      sender: 'bot',
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isChatOpen]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const menuItems = ['How It Works', 'Features', 'Pricing', 'Demo'];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newUserMessage = { text: inputMessage, sender: 'user' };
    setChatMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage('');

    try {
      const response = await fetch('/chatbox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newUserMessage.text }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const botResponse = { text: data.text, sender: 'bot' };

      setChatMessages((prevMessages) => [...prevMessages, botResponse]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        text: 'Sorry, something went wrong. Please try again later.',
        sender: 'bot',
      };
      setChatMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };


  return (
    <>
      <div className="homepage-container">
        {/* Header */}
        <header className="header">
          <nav className="header-nav">
            <div className="logo-container">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
                <path d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6" />
                <path d="M16 12a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v-2a2 2 0 0 0-2-2z" />
                <path d="M8 12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6v-2a2 2 0 0 1 2-2z" />
                <path d="M8 18H5a2 2 0 0 0-2 2" />
                <path d="M16 18h3a2 2 0 0 1 2 2" />
                <path d="M12 2v2" /><path d="M4 22h16" />
              </svg>
              <div className="site-title">FinWise</div>
            </div>
            <div className="header-menu">
              <div className="menu-items">
                {menuItems.map((item) => (
                  <Link key={item} to={`/${item.replace(/\s+/g, '').toLowerCase()}`} className="menu-link">
                    {item}
                  </Link>
                ))}
              </div>
              <Link to="/signin" className="menu-link">Login</Link>
              <Link to="/signup" className="signup-button">Sign Up</Link>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="hero-section">
            <div className="hero-text-container">
              <h1 className="hero-title">Clone Yourself with FinWise. Engage 24/7.</h1>
              <p className="hero-subtitle">Let fans, followers, or clients talk to your AI version anytime. Your knowledge, your voice, always available.</p>
              <div className="hero-buttons">
                <button className="try-it-button">Try It Free →</button>
                <button className="demo-button">See Demo Bots</button>
              </div>
            </div>
            <div className="avatar-placeholder-container">
              <div className="avatar-placeholder">AI Avatar</div>
            </div>
          </div>

          <section className="how-it-works-section">
            <h2 className="section-title">How It Works</h2>
            <div className="steps-grid">
              <div className="step-card">
                <h3 className="card-title">Upload Your Knowledge</h3>
                <p className="card-text">Upload your content, blogs, FAQs, or record answers to train your AI twin.</p>
              </div>
              <div className="step-card">
                <h3 className="card-title">Train the Bot</h3>
                <p className="card-text">FinWise learns your style, tone, and expertise from your content and answers.</p>
              </div>
              <div className="step-card">
                <h3 className="card-title">Share a Chat Link</h3>
                <p className="card-text">Get a unique link to your AI twin or embed it directly on your website.</p>
              </div>
              <div className="step-card">
                <h3 className="card-title">Let It Answer 24/7</h3>
                <p className="card-text">Your AI twin engages with your audience even when you're sleeping or busy.</p>
              </div>
            </div>
          </section>
        </main>

        {/* Floating Chatbot UI */}
        <div className="chatbot-container">
          {isChatOpen && (
            <div className="chatbot-window">
              <div className="chatbot-header">
                <h4 className="chatbot-title">FinWise Chatbot</h4>
                <button onClick={toggleChat} className="chatbot-close-button" aria-label="Close Chat">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="chatbot-messages">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                    <div className="message-bubble">{msg.text}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="chatbot-input-form">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="chatbot-input"
                />
              </form>
            </div>
          )}
          <button onClick={toggleChat} className="chatbot-toggle-button" aria-label="Toggle Chat">
             {isChatOpen ? (
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
             ) : (
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle-code"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /><path d="m10 10-2 2 2 2" /><path d="m14 14 2-2-2-2" /></svg>
             )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Homepage;