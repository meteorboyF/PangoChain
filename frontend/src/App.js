import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Cases from "./pages/Cases";
import Documents from "./pages/Documents";
import Messages from "./pages/Messages";
import AuditLog from "./pages/AuditLog";
import BlockchainDashboard from "./pages/BlockchainDashboard";
import CloudinaryFeatures from "./pages/CloudinaryFeatures";
import ScanToDocument from "./pages/ScanToDocument";
import LegalFramework from "./pages/LegalFramework";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', role: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
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
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserInfo({ name: '', role: '' });
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

  if (!isAuthenticated) {
    return (
      <Router>
        <div className="auth-container" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f8f9fa'}}>
          <div style={{background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: '400px'}}>
            <h1 style={{textAlign: 'center', marginBottom: '30px', color: '#2c3e50'}}>🔗 PangoChain Legal System</h1>
            <div style={{display: 'flex', gap: '20px', marginBottom: '30px', justifyContent: 'center'}}>
              <Link to="/login" style={{textDecoration: 'none'}}>
                <button 
                  style={{padding: '12px 24px', background: '#007bff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '16px'}}
                >
                  👨‍⚖️ Lawyer Login
                </button>
              </Link>
              <button 
                style={{padding: '12px 24px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'not-allowed', fontSize: '16px', opacity: '0.6'}}
                disabled
                title="Client portal coming soon"
              >
                👤 Client (Coming Soon)
              </button>
            </div>
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            <div style={{textAlign: 'center', marginTop: '20px'}}>
              <Link to="/login" style={{color: '#007bff', textDecoration: 'none', marginRight: '20px'}}>Login</Link>
              <Link to="/register" style={{color: '#007bff', textDecoration: 'none'}}>Register New Lawyer</Link>
            </div>
          </div>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <div className="sidebar">
          <h2>🔗 PangoChain</h2>
          {/* Lawyer-only navigation */}
          {(userInfo.role === 'partner' || userInfo.role === 'associate' || userInfo.role === 'junior' || userInfo.role === 'paralegal') && (
            <>
              <Link to="/home">📊 Dashboard</Link>
              <Link to="/cases">⚖️ Cases</Link>
              <Link to="/documents">📄 Documents</Link>
              <Link to="/scan-to-doc">📱➡️📄 Scan to Doc</Link>
              <Link to="/cloudinary">☁️ Cloudinary OCR</Link>
              <Link to="/blockchain">🔗 Blockchain</Link>
              <Link to="/legal-framework">⚖️ Legal Framework</Link>
              <Link to="/messages">💬 Messages</Link>
              <Link to="/auditlog">📋 Audit Log</Link>
            </>
          )}
        </div>

        {/* Main Area */}
        <div className="main-content">
          {/* Topbar */}
          <div className="topbar">
            <span>{userInfo.name} ({userInfo.role}) - 🔗 Blockchain Enabled</span>
            <button onClick={handleLogout} style={{padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Logout</button>
          </div>

          {/* Page Content */}
          <div className="content">
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/cases" element={<Cases />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/scan-to-doc" element={<ScanToDocument />} />
              <Route path="/cloudinary" element={<CloudinaryFeatures />} />
              <Route path="/blockchain" element={<BlockchainDashboard />} />
              <Route path="/legal-framework" element={<LegalFramework />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/auditlog" element={<AuditLog />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;