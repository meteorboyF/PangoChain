import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // make sure you create this file for styling

const Navbar = () => {
  return (
    <div className="sidebar">
      <h2>PangoChain</h2>
      <nav>
        <Link to="/home">Dashboard</Link>
        <Link to="/cases">Cases</Link>
        <Link to="/documents">Documents</Link>
        <Link to="/messages">Messages</Link>
        <Link to="/auditlog">Audit Log</Link>
      </nav>
    </div>
  );
};

export default Navbar;
