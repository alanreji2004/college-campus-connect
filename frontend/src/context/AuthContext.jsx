import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('cc_access_token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('cc_refresh_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      if (!accessToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem('cc_access_token');
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, [accessToken]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { accessToken: at, refreshToken: rt, user: u } = res.data;
    setUser(u);
    setAccessToken(at);
    setRefreshToken(rt);
    localStorage.setItem('cc_access_token', at);
    localStorage.setItem('cc_refresh_token', rt);
  };

  const logout = async () => {
    try {
      const rt = localStorage.getItem('cc_refresh_token');
      if (rt) {
        await api.post('/auth/logout', { refreshToken: rt });
      }
    } catch {
      // ignore
    } finally {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem('cc_access_token');
      localStorage.removeItem('cc_refresh_token');
    }
  };

  const value = useMemo(
    () => ({
      user,
      roles: user?.roles || [],
      accessToken,
      refreshToken,
      loading,
      login,
      logout
    }),
    [user, accessToken, refreshToken, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

