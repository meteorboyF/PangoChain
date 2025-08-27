import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Cases from "./pages/Cases";
import Documents from "./pages/Documents";
import Messages from "./pages/Messages";
import AuditLog from "./pages/AuditLog";
import "./App.css";

function App() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <div className="sidebar">
          <h2>PangoChain</h2>
          <Link to="/home">Dashboard</Link>
          <Link to="/cases">Cases</Link>
          <Link to="/documents">Documents</Link>
          <Link to="/messages">Messages</Link>
          <Link to="/auditlog">Audit Log</Link>
        </div>

        {/* Main Area */}
        <div className="main-content">
          {/* Topbar */}
          <div className="topbar">
            <span>Alice Partner (partner)</span>
            <button onClick={handleLogout}>Logout</button>
          </div>

          {/* Page Content */}
          <div className="content">
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/cases" element={<Cases />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/auditlog" element={<AuditLog />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
