// src/components/CTA.js
import React from 'react';
import './CTA.css';
import { NavLink } from 'react-router-dom';

const CTA = () => {
  return (
    <div className="cta-container">
      <h2>Ready to Secure Your Practice?</h2>
      <p>Explore the Veritas Legal Portal and experience the future of legal data integrity.</p>
      <NavLink to="/lawyer" className="cta-button">
        Access the Portal
      </NavLink>
    </div>
  );
};

export default CTA;