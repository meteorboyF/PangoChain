import React from "react";
import { Link } from "react-router-dom";
import { FaGavel, FaFileAlt, FaEnvelope, FaHistory } from 'react-icons/fa'; // Import icons
import "./Home.css";

function Home() {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  return (
    <div className="home-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="welcome-message">
          Welcome, <strong>{name}</strong> ({role})
        </p>
      </div>

      <div className="dashboard-cards">
        <Link to="/app/cases" className="dashboard-card">
          <FaGavel className="card-icon" />
          <div className="card-content">
            <h3>Cases</h3>
            <p>Manage legal cases and assign tasks.</p>
          </div>
        </Link>

        <Link to="/app/documents" className="dashboard-card">
          <FaFileAlt className="card-icon" />
          <div className="card-content">
            <h3>Documents</h3>
            <p>Upload, verify, and secure case files.</p>
          </div>
        </Link>

        <Link to="/app/messages" className="dashboard-card">
          <FaEnvelope className="card-icon" />
          <div className="card-content">
            <h3>Messages</h3>
            <p>Communicate securely with the team.</p>
          </div>
        </Link>

        <Link to="/app/auditlog" className="dashboard-card">
          <FaHistory className="card-icon" />
          <div className="card-content">
            <h3>Audit Log</h3>
            <p>Review blockchain-backed activity.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Home;