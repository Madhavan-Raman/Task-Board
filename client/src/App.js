import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Tasks from "./Tasks";
import "./App.css";  // ✅ import CSS

function App() {
  return (
    <Router>
      {/* Left side particles */}
      <div className="side-particle left" style={{ "--i": 0 }}></div>
      <div className="side-particle left blue" style={{ "--i": 1 }}></div>
      <div className="side-particle left" style={{ "--i": 2 }}></div>

      {/* Right side particles */}
      <div className="side-particle right" style={{ "--i": 0 }}></div>
      <div className="side-particle right blue" style={{ "--i": 1 }}></div>
      <div className="side-particle right" style={{ "--i": 2 }}></div>

      <div className="app-container">
        <h1>✅ TaskBoard</h1>

        {/* Nav links styled with your CSS */}
        <nav className="nav-links">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks/:userId" element={<Tasks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
