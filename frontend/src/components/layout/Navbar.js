import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './Layout.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="navbar">
      <div className="navbar-user-info">
        <h3>Welcome, {user ? user.name : 'Guest'} ({user ? user.role : ''})</h3>
      </div>
      <button onClick={logout} className="logout-button">
        Logout
      </button>
    </header>
  );
};

export default Navbar;