import React, { useState } from "react";
import { registerUser } from "../api/authAPI";
import { Link } from "react-router-dom";
import ParticleBackground from '../components/ParticleBackground'; // Import the particle background

// Updated styles to match the new dark, modern theme.
const RegisterStyles = () => (
  <style>
    {`
      /* Root variables from index.css for consistency */
      :root {
        --background-color: #121212;
        --text-color: #EAEAEA;
        --primary-color: #00A99D; /* Teal */
        --secondary-color: #1E1E1E;
        --accent-color: #D4AF37; /* Gold */
      }

      .register-page-container {
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

      .register-card {
        background: rgba(30, 30, 30, 0.75);
        backdrop-filter: blur(10px);
        padding: 40px;
        border-radius: 12px;
        border: 1px solid rgba(212, 175, 55, 0.3); /* Subtle gold border */
        box-shadow: 0 0 25px rgba(212, 175, 55, 0.2); /* Gold glow */
        width: 100%;
        max-width: 450px;
      }

      .register-header {
        text-align: center;
        margin-bottom: 30px;
        color: var(--text-color);
        font-size: 2rem;
        font-weight: 700;
        letter-spacing: 1px;
      }

      .register-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .register-form input,
      .register-form select {
        padding: 15px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        font-size: 16px;
        color: var(--text-color);
        width: 100%;
        box-sizing: border-box;
        font-family: inherit;
        -webkit-appearance: none; /* Removes default OS styling for select */
        -moz-appearance: none;
        appearance: none;
        background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23EAEAEA%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E');
        background-repeat: no-repeat;
        background-position: right 15px top 50%;
        background-size: .65em auto;
      }
      
      .register-form input:focus,
      .register-form select:focus {
        border-color: var(--accent-color); /* Gold focus */
        outline: none;
        box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.4);
      }

      .register-form button {
        padding: 15px;
        background: var(--accent-color); /* Gold for register button */
        color: #121212; /* Dark text on gold button */
        border: none;
        border-radius: 6px;
        font-weight: 700;
        cursor: pointer;
        font-size: 16px;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: all 0.2s ease-in-out;
        margin-top: 10px;
      }
      
      .register-form button:hover {
        background: #E0BB4A; /* Brighter gold on hover */
        box-shadow: 0 0 15px rgba(224, 187, 74, 0.5);
      }

      .register-message {
        margin-top: 1rem;
        font-size: 0.9rem;
        text-align: center;
        font-weight: 500;
      }

      .register-message.error {
        color: #ff6b6b; /* Brighter red */
      }

      .register-message.success {
        color: #51cf66; /* Brighter green */
      }
      
      .login-link {
        margin-top: 1.5rem;
        font-size: 0.9rem;
        text-align: center;
        color: rgba(234, 234, 234, 0.7);
      }
      
      .login-link a {
        color: var(--primary-color); /* Use teal for the link for contrast */
        text-decoration: none;
        font-weight: 700;
      }

      .login-link a:hover {
        text-decoration: underline;
      }
    `}
  </style>
);

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "associate",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    try {
      const res = await registerUser(formData);
      setMessage(res.data.message || "Registration successful! You can now log in.");
      setIsError(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error registering user. Please try again.");
      setIsError(true);
    }
  };

  return (
    <>
      <RegisterStyles />
      <ParticleBackground />
      <div className="register-page-container">
        <div className="register-card">
          <h2 className="register-header">🔗 Register Firm</h2>
          <form onSubmit={handleSubmit} className="register-form">
            <input 
              name="name" 
              placeholder="Full Name" 
              onChange={handleChange} 
              required 
            />
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
            <select name="role" onChange={handleChange} value={formData.role}>
              <option value="associate">Associate Lawyer</option>
              <option value="partner">Partner</option>
              <option value="junior">Junior Lawyer</option>
              <option value="paralegal">Paralegal</option>
            </select>
            <button type="submit">Create Account</button>
          </form>
          {message && (
            <p className={`register-message ${isError ? 'error' : 'success'}`}>
              {message}
            </p>
          )}
          <div className="login-link">
            <span>Already have an account? </span>
            <Link to="/login">Login Here</Link>
                 </div>
          
        </div>
      </div>
    </>
  );
}

export default Register;