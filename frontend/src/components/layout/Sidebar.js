import React from 'react';
import { NavLink } from 'react-router-dom';
import './Layout.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h1 className="sidebar-logo">PangoChain</h1>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/cases">Cases</NavLink>
        <NavLink to="/documents">Documents</NavLink>
        <NavLink to="/messages">Messages</NavLink>
        <NavLink to="/audit-log">Audit Log</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;