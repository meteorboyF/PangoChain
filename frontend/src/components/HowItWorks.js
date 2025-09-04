// src/components/HowItWorks.js
import React from 'react';
import { useInView } from 'react-intersection-observer';
import './HowItWorks.css';
import { FaBalanceScale, FaGavel, FaFileSignature } from 'react-icons/fa'; // More thematic icons

const HowItWorks = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="how-it-works-container">
      <h2>A Seamless Workflow for Unbreakable Trust</h2>
      <div ref={ref} className={`steps-grid ${inView ? 'is-visible' : ''}`}>
        <div className="step-card">
          <FaBalanceScale className="step-icon" />
          <h3>1. Register & Verify</h3>
          <p>Securely register your legal documents. A unique, permanent fingerprint is generated on the PangoChain ledger for irrefutable proof of existence.</p>
        </div>
        <div className="step-card">
          <FaGavel className="step-icon" />
          <h3>2. Control & Govern</h3>
          <p>Your documents are encrypted and stored. Govern exactly who has access with our dynamic, role-based permission controls enforced by smart contracts.</p>
        </div>
        <div className="step-card">
          <FaFileSignature className="step-icon" />
          <h3>3. Transact & Enforce</h3>
          <p>Share documents, negotiate, and collect legally-binding e-signatures within a secure environment. Verify any document's authenticity instantly.</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;