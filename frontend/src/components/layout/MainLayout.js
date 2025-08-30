import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css'; // We'll create this CSS file

const MainLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="page-content">
          <Outlet /> {/* This is where the routed page component will be rendered */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;