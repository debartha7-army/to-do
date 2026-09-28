import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('orbit_notes_token') || null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const res = await api.getMe();
          if (res.user) {
            setUser({
              id: res.user.id,
              email: res.user.email,
              displayName: res.user.display_name || res.user.displayName
            });
          }
        } catch (err) {
          console.warn('[AuthContext] Session expired or invalid:', err.message);
          localStorage.removeItem('orbit_notes_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.token) {
      localStorage.setItem('orbit_notes_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setIsAuthModalOpen(false);
    }
    return res;
  };

  const signup = async (email, password, displayName) => {
    const res = await api.signup(email, password, displayName);
    if (res.token) {
      localStorage.setItem('orbit_notes_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setIsAuthModalOpen(false);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('orbit_notes_token');
    setToken(null);
    setUser(null);
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuth = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthModalOpen,
        authMode,
        setAuthMode,
        openAuth,
        closeAuth,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
