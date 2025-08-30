import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './homepage.jsx';
import Signin from './signin.jsx';
import Signup from './signup.jsx';
import Dashboard from "./Dashboard.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        {/* You should also add routes for your other menu items */}
        
      </Routes>
    </BrowserRouter>
  );
};

export default App;