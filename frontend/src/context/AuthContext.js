import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('sg_user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('sg_token'));

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('sg_user', JSON.stringify(data));
    localStorage.setItem('sg_token', data.token);
    setUser(data);
    setToken(data.token);
    setAuthToken(data.token);
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('sg_user', JSON.stringify(data));
    localStorage.setItem('sg_token', data.token);
    setUser(data);
    setToken(data.token);
    setAuthToken(data.token);
  };

  const logout = () => {
    localStorage.removeItem('sg_user');
    localStorage.removeItem('sg_token');
    setUser(null);
    setToken(null);
    setAuthToken(null);
  };

  const value = useMemo(() => ({ user, token, login, register, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
