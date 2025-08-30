import React, { createContext, useReducer, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import api from '../api/api'; // We will create this next

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        // Check if the token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
        } else {
          const user = { id: decodedToken.id, name: decodedToken.name, role: decodedToken.role };
          dispatch({ type: 'LOGIN', payload: { user, token } });
        }
      } catch (error) {
        console.error("Invalid token found", error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token } = response.data;
    const decodedToken = jwt_decode(token);
    const user = { id: decodedToken.id, name: decodedToken.name, role: decodedToken.role };

    localStorage.setItem('token', token);
    dispatch({ type: 'LOGIN', payload: { user, token } });
  };

  const register = async (userData) => {
    return await api.post('/auth/register', userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};