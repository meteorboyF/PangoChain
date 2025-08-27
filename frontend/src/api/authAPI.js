 import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth", // direct backend URL
});

// Register
export const registerUser = async (userData) => {
  return await API.post("/register", userData);
};

// Login
export const loginUser = async (userData) => {
  return await API.post("/login", userData);
};
