 import axios from "axios";

const API = axios.create({
  baseURL: "/api/auth", // use proxy to backend on 5001
});

// Register
export const registerUser = async (userData) => {
  return await API.post("/register", userData);
};

// Login
export const loginUser = async (userData) => {
  return await API.post("/login", userData);
};
