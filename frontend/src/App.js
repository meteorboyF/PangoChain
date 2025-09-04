import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, Outlet } from "react-router-dom";

// Import all your pages
import Home from "./pages/Home";
import Cases from "./pages/Cases";
import Documents from "./pages/Documents";
import Messages from "./pages/Messages";
import AuditLog from "./pages/AuditLog";
import BlockchainDashboard from "./pages/BlockchainDashboard";
import CloudinaryFeatures from "./pages/CloudinaryFeatures";
import ScanToDocument from "./pages/ScanToDocument";
import LegalFramework from "./pages/LegalFramework";
import AdvancedFeatures from "./pages/AdvancedFeatures";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage"; // Import the new landing page wrapperimport "
import "./App.css";
// This is the layout for the protected part of your app
const ProtectedLayout = ({ userInfo, onLogout }) => {
  // If no user info, don't render anything (the ProtectedRoute will handle redirect)
  if (!userInfo) return null;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>🔗 PangoChain</h2>
        {(userInfo.role === 'partner' || userInfo.role === 'associate' || userInfo.role === 'junior' || userInfo.role === 'paralegal') && (
          <>
            <Link to="/app/home">Dashboard</Link>
            <Link to="/app/cases">Cases</Link>
            <Link to="/app/documents">Documents</Link>
            <Link to="/app/scan-to-doc">Scan to Doc</Link>
            <Link to="/app/cloudinary">Cloudinary OCR</Link>
            <Link to="/app/blockchain">Blockchain</Link>
            <Link to="/app/advanced">Advanced Features</Link>
            <Link to="/app/legal-framework">Legal Framework</Link>
            <Link to="/app/messages">Messages</Link>
            <Link to="/app/auditlog">Audit Log</Link>
          </>
        )}
      </div>

      {/* Main Area */}
      <div className="main-content">
        <div className="topbar">
          <span>{userInfo.name} ({userInfo.role}) - 🔗 Blockchain Enabled</span>
          <button onClick={onLogout} style={{padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Logout</button>
        </div>
        <div className="content">
          <Outlet /> {/* Child routes will render here */}
        </div>
      </div>
    </div>
  );
};

// This component checks for authentication and renders the layout or redirects
const ProtectedRoute = ({ isAuthenticated, userInfo, onLogout }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <ProtectedLayout userInfo={userInfo} onLogout={onLogout} />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');
    
    if (token && name && role) {
      setIsAuthenticated(true);
      setUserInfo({ name, role });
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserInfo(null);
  };

  const handleLogin = (token, name, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('name', name);
    localStorage.setItem('role', role);
    setIsAuthenticated(true);
    setUserInfo({ name, role });
  };

  if (loading) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <h2>🔗 Loading PangoChain...</h2>
    </div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/app" element={<ProtectedRoute isAuthenticated={isAuthenticated} userInfo={userInfo} onLogout={handleLogout} />}>
          {/* These are the nested routes that will render inside ProtectedLayout's <Outlet> */}
          <Route path="home" element={<Home />} />
          <Route path="cases" element={<Cases />} />
          <Route path="documents" element={<Documents />} />
          <Route path="scan-to-doc" element={<ScanToDocument />} />
          <Route path="cloudinary" element={<CloudinaryFeatures />} />
          <Route path="blockchain" element={<BlockchainDashboard />} />
          <Route path="advanced" element={<AdvancedFeatures />} />
          <Route path="legal-framework" element={<LegalFramework />} />
          <Route path="messages" element={<Messages />} />
          <Route path="auditlog" element={<AuditLog />} />
          {/* Redirect from /app to /app/home */}
          <Route index element={<Navigate to="/app/home" replace />} />
        </Route>

        {/* Catch-all route to redirect to landing page if no other route matches */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;