import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // On first load, if a token is already stored, hydrate the user from it
  // instead of forcing a re-login on every refresh.
  useEffect(() => {
    const token = localStorage.getItem('em_token');
    if (!token) {
      setInitializing(false);
      return;
    }

    authService
      .getMe()
      .then(({ user: me }) => setUser(me))
      .catch(() => localStorage.removeItem('em_token'))
      .finally(() => setInitializing(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const { token, user: loggedInUser } = await authService.login(credentials);
    localStorage.setItem('em_token', token);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async (payload) => {
    const { token, user: newUser } = await authService.register(payload);
    localStorage.setItem('em_token', token);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Best-effort: even if the network call fails, clear the local session.
    }
    localStorage.removeItem('em_token');
    setUser(null);
    toast.success("You've been logged out");
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        initializing,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
