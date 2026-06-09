import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as loginApi, getMe } from '../api/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('orbitflow_token');
      const savedUser = localStorage.getItem('orbitflow_user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
          // Verify token is still valid
          const data = await getMe();
          setUser(data.user);
          localStorage.setItem('orbitflow_user', JSON.stringify(data.user));
        } catch {
          // Token expired or invalid
          logout();
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await loginApi(username, password);
    localStorage.setItem('orbitflow_token', data.token);
    localStorage.setItem('orbitflow_user', JSON.stringify(data.user));
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('orbitflow_token');
    localStorage.removeItem('orbitflow_user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('orbitflow_user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
