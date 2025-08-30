import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-logo">PangoChain</h2>
      <ul className="sidebar-links">
        <li><Link to="/home">Dashboard</Link></li>
        <li><Link to="/cases">Cases</Link></li>
        <li><Link to="/documents">Documents</Link></li>
        <li><Link to="/messages">Messages</Link></li>
        <li><Link to="/auditlog">Audit Log</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
