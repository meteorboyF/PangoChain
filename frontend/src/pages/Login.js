import React, { useState } from "react";
import { loginUser } from "../api/authAPI";
import { useNavigate, Link } from "react-router-dom";
import ParticleBackground from '../components/ParticleBackground'; // Import the particle background

// Updated styles to match the new dark, modern theme.
const LoginStyles = () => (
  <style>
    {`
      /* Root variables from index.css for consistency */
      :root {
        --background-color: #121212;
        --text-color: #EAEAEA;
        --primary-color: #00A99D; /* Teal */
        --secondary-color: #1E1E1E; /* Dark gray for cards */
        --accent-color: #D4AF37; /* Gold */
      }

      .login-page-container {
        /* This container now sits ON TOP of the particle background */
        position: relative;
        z-index: 2;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;
      }

      .login-card {
        background: rgba(30, 30, 30, 0.75); /* Semi-transparent dark background */
        backdrop-filter: blur(10px); /* Frosted glass effect */
        padding: 40px;
        border-radius: 12px;
        border: 1px solid rgba(0, 169, 157, 0.3); /* Subtle teal border */
        box-shadow: 0 0 25px rgba(0, 169, 157, 0.2); /* Teal glow */
        width: 100%;
        max-width: 450px;
      }

      .login-header {
        text-align: center;
        margin-bottom: 30px;
        color: var(--text-color); /* Light text */
        font-size: 2rem;
        font-weight: 700;
        letter-spacing: 1px;
      }

      .login-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem; /* A bit more spacing */
      }

      .login-form input {
        padding: 15px;
        background: rgba(255, 255, 255, 0.05); /* Very subtle background */
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        font-size: 16px;
        color: var(--text-color); /* Light text for input */
        width: 100%;
        box-sizing: border-box;
        transition: all 0.2s ease-in-out;
      }
      
      .login-form input::placeholder {
        color: rgba(234, 234, 234, 0.5); /* Lighter placeholder text */
      }

      .login-form input:focus {
        border-color: var(--primary-color);
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 169, 157, 0.4);
      }

      .login-form button {
        padding: 15px;
        background: var(--primary-color);
        color: #FFFFFF;
        border: none;
        border-radius: 6px;
        font-weight: 700;
        cursor: pointer;
        font-size: 16px;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: all 0.2s ease-in-out;
      }
      
      .login-form button:hover {
        background: #00C7B8; /* Brighter teal on hover */
        box-shadow: 0 0 15px rgba(0, 199, 184, 0.5);
      }

      .login-message {
        margin-top: 1rem;
        font-size: 0.9rem;
        text-align: center;
        font-weight: 500;
      }

      .login-message.error {
        color: #ff6b6b; /* Brighter red for dark background */
      }

      .login-message.success {
        color: #51cf66; /* Brighter green */
      }
      
      .register-link {
        margin-top: 1.5rem;
        font-size: 0.9rem;
        text-align: center;
        color: rgba(234, 234, 234, 0.7);
      }
      
      .register-link a {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 700;
      }

      .register-link a:hover {
        text-decoration: underline;
      }
    `}
  </style>
);


function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    try {
      const res = await loginUser(formData);
      
      const allowedRoles = ['partner', 'associate', 'junior', 'paralegal'];
      if (!allowedRoles.includes(res.data.role)) {
        setMessage("Access denied. This portal is for legal professionals only.");
        setIsError(true);
        return;
      }
      
      setMessage(`Login successful! Redirecting...`);
      onLogin(res.data.token, res.data.name, res.data.role);
      
      setTimeout(() => navigate("/app/home"), 1000);

    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Login failed. Please check your credentials.");
      setIsError(true);
    }
  };

  return (
    <>
      <LoginStyles />
      {/* The particle background now covers the entire page */}
      <ParticleBackground />
      <div className="login-page-container">
        <div className="login-card">
          <h2 className="login-header">🔗 Lawyer Login</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <button type="submit">Login</button>
          </form>
          {message && (
            <p className={`login-message ${isError ? 'error' : 'success'}`}>
              {message}
            </p>
          )}
          <div className="register-link">
            <span>Don't have an account? </span>
            <Link to="/register">Register Here</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;