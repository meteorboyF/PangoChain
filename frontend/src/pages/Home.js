 import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  return (
    <div className="home">
      <h2>Dashboard</h2>
      <p>
        Welcome, <strong>{name}</strong>! You are logged in as{" "}
        <strong>{role}</strong>.
      </p>

      <div className="cards">
        <Link to="/cases" className="card">
          <h3>Cases</h3>
          <p>Manage legal cases and assign tasks.</p>
        </Link>

        <Link to="/documents" className="card">
          <h3>Documents</h3>
          <p>Upload, verify, and secure case files.</p>
        </Link>

        <Link to="/messages" className="card">
          <h3>Messages</h3>
          <p>Communicate securely with clients & team.</p>
        </Link>

        <Link to="/audit" className="card">
          <h3>Audit Log</h3>
          <p>Review blockchain-backed activity history.</p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
