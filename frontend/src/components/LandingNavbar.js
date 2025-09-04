// src/components/Navbar.js
import React from 'react';
import './LandingNavbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/">Veritas Legal</a>
      </div>
      <ul className="navbar-links">
        <li><a href="#features">Technology</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
      <div className="navbar-actions">
        <a href="/Login" className="navbar-secondary-cta">Portal Login</a>
        <a href="/Register" className="navbar-cta">Register</a>
      </div>
    </nav>
  );
};

export default Navbar;