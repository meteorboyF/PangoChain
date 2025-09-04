// src/components/Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <p>&copy; {currentYear} Veritas Legal. All Rights Reserved.</p>
      <p>Powered by PangoChain</p>
    </footer>
  );
};

export default Footer;