import React, { useState } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { BarChart2, DollarSign, LogOut, Menu, MessageSquare, Send } from 'lucide-react';
import AnalysisView from './AnalysisView';
import MarketPricesView from './MarketPricesView';
import './dashboard.css';

// AI Chatbot Component
const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chatbox', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: currentInput })
            });
            const data = await response.json();
            const aiMessage = { text: data.text, sender: 'ai' };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = { text: 'Sorry, I am having trouble connecting.', sender: 'ai' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button onClick={() => setIsOpen(!isOpen)} className={`chatbot-toggle ${isOpen ? 'hidden' : ''}`}><MessageSquare /></button>
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header"><h3>FinBot Assistant</h3><button onClick={() => setIsOpen(false)}>&times;</button></div>
                    <div className="chatbot-messages">
                        {messages.map((msg, index) => <div key={index} className={`message ${msg.sender}`}>{msg.text}</div>)}
                        {isLoading && <div className="message ai typing-indicator"><span></span><span></span><span></span></div>}
                    </div>
                    <form onSubmit={handleSend} className="chatbot-input-form">
                        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask a financial question..." />
                        <button type="submit" disabled={isLoading}><Send size={18} /></button>
                    </form>
                </div>
            )}
        </>
    );
};


// Main Dashboard Layout
const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    
    // Assumes user object { username: '...' } is in localStorage after login
    const user = JSON.parse(localStorage.getItem('finwiseUser'));

    const handleLogout = () => {
        localStorage.removeItem('finwiseUser');
        window.location.href = '/login'; // Redirect to login page
    };

    const menuItems = [
        { path: 'analysis', label: 'AI Analysis', icon: BarChart2 },
        { path: 'prices', label: 'Market Prices', icon: DollarSign },
    ];

    return (
        <div className="dashboard-container">
            <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                <div>
                    <div className="sidebar-header">
                        {!collapsed && <div className="logo"><span>💰</span><span className="logo-text">FinWise</span></div>}
                        <button className="sidebar-toggle-btn" onClick={() => setCollapsed(!collapsed)}><Menu size={20} /></button>
                    </div>
                    <nav className="sidebar-nav">
                        {menuItems.map(item => (
                            <NavLink key={item.path} to={item.path} className="sidebar-item">
                                <item.icon className="sidebar-item-icon" />
                                {!collapsed && <span className="sidebar-item-label">{item.label}</span>}
                            </NavLink>
                        ))}
                    </nav>
                </div>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="sidebar-item logout">
                        <LogOut className="sidebar-item-icon" />
                        {!collapsed && <span className="sidebar-item-label">Logout</span>}
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="main-header">
                    <h2 className="main-header-title">Welcome, {user?.username || 'User'}</h2>
                </header>
                <div className="content-area">
                    <Routes>
                        <Route path="analysis" element={<AnalysisView />} />
                        <Route path="prices" element={<MarketPricesView />} />
                        <Route path="*" element={<Navigate to="analysis" />} />
                    </Routes>
                </div>
            </main>
            <Chatbot />
        </div>
    );
};

export default Dashboard;