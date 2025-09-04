// src/components/FeaturesSection.js
import React from 'react';
import { useInView } from 'react-intersection-observer';
import './FeaturesSection.css';

const FeaturesSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div id="features" className="features-container">
      <h2 className="features-title">A New Standard for Legal Security</h2>
      <div ref={ref} className={`features-grid ${inView ? 'is-visible' : ''}`}>
        <div className="feature-card">
          <h3>Immutable Document Vault</h3>
          <p>Every document is cryptographically registered on the blockchain, creating a permanent, verifiable "birth certificate" that cannot be altered.</p>
        </div>
        <div className="feature-card">
          <h3>Dynamic Access Control</h3>
          <p>Manage precisely who can view, edit, or share documents with role-based permissions and temporary access rules that can be automatically revoked.</p>
        </div>
        <div className="feature-card">
          <h3>Unbreakable Audit Log</h3>
          <p>A live, unchangeable log shows every action taken—who, what, and when. Every successful and failed attempt is recorded for complete transparency.</p>
        </div>
        <div className="feature-card">
          <h3>Secure Collaboration</h3>
          <p>Share files and communicate through end-to-end encrypted channels. Request and record legally binding e-signatures directly within the platform.</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;