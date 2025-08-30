import React, { useState } from "react";
import { loginUser } from "../api/authAPI";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      
      // Only allow lawyer roles
      const allowedRoles = ['partner', 'associate', 'junior', 'paralegal'];
      if (!allowedRoles.includes(res.data.role)) {
        setMessage("Access denied. This portal is for legal professionals only.");
        return;
      }
      
      setMessage(`Welcome ${res.data.name} (${res.data.role})`);
      
      // Use callback to update parent component
      if (onLogin) {
        onLogin(res.data.token, res.data.name, res.data.role);
      } else {
        // Fallback for direct access
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("name", res.data.name);
        navigate("/home");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        /><br/>
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        /><br/>
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;
