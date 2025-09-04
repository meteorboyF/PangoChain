// src/components/HeroSection.js
import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <div className="hero-container">
      <h1 className="hero-headline">
        Your Blockchain-Powered Shield for Legal Data Integrity
      </h1>
      <p className="hero-subheadline">
        Veritas Legal leverages PangoChain's immutable ledger to ensure your sensitive documents are secure, authentic, and tamper-proof.
      </p>
    </div>
  );
};

export default HeroSection;