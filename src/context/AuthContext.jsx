import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => sessionStorage.getItem('suprema_token') || localStorage.getItem('suprema_token') || null);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to persist session & tab-isolated login type
  const persistSession = (authToken, userData, loginType = null) => {
    if (authToken) {
      sessionStorage.setItem('suprema_token', authToken);
      localStorage.setItem('suprema_token', authToken);
    }
    
    // Priority:
    // 1. Explicit loginType parameter ('admin' | 'user')
    // 2. User's role from server data ('super_admin', 'admin', 'developer' -> 'admin')
    // 3. Active tab's sessionStorage
    // 4. Shared localStorage fallback
    let effectiveType = loginType;
    if (!effectiveType && userData && userData.role) {
      effectiveType = ['super_admin', 'admin', 'developer'].includes(userData.role) ? 'admin' : 'user';
    }
    if (!effectiveType) {
      effectiveType = sessionStorage.getItem('suprema_login_type') || localStorage.getItem('suprema_last_login_type') || 'user';
    }

    sessionStorage.setItem('suprema_login_type', effectiveType);
    localStorage.setItem('suprema_last_login_type', effectiveType);
  };

  // Initial Auth Verification on Page Load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = sessionStorage.getItem('suprema_token') || localStorage.getItem('suprema_token');
      if (storedToken) {
        try {
          const data = await api.get('/auth/me');
          if (data.success && data.user) {
            setUser(data.user);
            persistSession(storedToken, data.user);
            // Default active workspace to first workspace
            if (data.user.workspaces && data.user.workspaces.length > 0) {
              const savedWsId = sessionStorage.getItem('suprema_active_ws_id') || localStorage.getItem('suprema_active_ws_id');
              const foundWs = data.user.workspaces.find(w => w.id === parseInt(savedWsId, 10));
              setActiveWorkspace(foundWs || data.user.workspaces[0]);
            }
          }
        } catch (err) {
          console.warn('Auth Session Expired or Invalid Token:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, explicitLoginType = null) => {
    console.log('[AuthContext] Attempting login for:', email);
    const data = await api.post('/auth/login', { email, password });
    console.log('[AuthContext] Login response:', data);
    if (data.success && data.token) {
      setToken(data.token);
      setUser(data.user);
      persistSession(data.token, data.user, explicitLoginType);
      if (data.user.workspaces && data.user.workspaces.length > 0) {
        setActiveWorkspace(data.user.workspaces[0]);
        sessionStorage.setItem('suprema_active_ws_id', data.user.workspaces[0].id);
        localStorage.setItem('suprema_active_ws_id', data.user.workspaces[0].id);
      }
      console.log('[AuthContext] Login successful, user set:', data.user.name);
      return data;
    }
    throw new Error(data.message || 'Login failed: Unexpected response from server');
  };

  const sendOtp = async (email) => {
    return await api.post('/auth/send-otp', { email });
  };

  const verifyOtp = async (name, email, password, otp) => {
    const data = await api.post('/auth/verify-otp', { name, email, password, otp });
    if (data.success && data.token) {
      setToken(data.token);
      setUser(data.user);
      persistSession(data.token, data.user, 'user');
      if (data.user.workspaces && data.user.workspaces.length > 0) {
        setActiveWorkspace(data.user.workspaces[0]);
        sessionStorage.setItem('suprema_active_ws_id', data.user.workspaces[0].id);
        localStorage.setItem('suprema_active_ws_id', data.user.workspaces[0].id);
      }
      return data;
    }
  };

  const register = async (name, email, password) => {
    const data = await api.post('/auth/register', { name, email, password });
    if (data.success && data.token) {
      setToken(data.token);
      setUser(data.user);
      persistSession(data.token, data.user, 'user');
      if (data.user.workspaces && data.user.workspaces.length > 0) {
        setActiveWorkspace(data.user.workspaces[0]);
        sessionStorage.setItem('suprema_active_ws_id', data.user.workspaces[0].id);
        localStorage.setItem('suprema_active_ws_id', data.user.workspaces[0].id);
      }
      return data;
    }
  };

  const logout = () => {
    const currentLoginType =
      sessionStorage.getItem('suprema_login_type') ||
      localStorage.getItem('suprema_last_login_type') ||
      (user && ['super_admin', 'admin', 'developer'].includes(user.role) ? 'admin' : 'user');

    sessionStorage.removeItem('suprema_token');
    sessionStorage.removeItem('suprema_active_ws_id');
    sessionStorage.removeItem('suprema_login_type');

    localStorage.removeItem('suprema_token');
    localStorage.removeItem('suprema_active_ws_id');
    localStorage.setItem('suprema_last_login_type', currentLoginType);

    setToken(null);
    setUser(null);
    setActiveWorkspace(null);
  };

  const switchWorkspace = (workspace) => {
    setActiveWorkspace(workspace);
    if (workspace?.id) {
      sessionStorage.setItem('suprema_active_ws_id', workspace.id);
      localStorage.setItem('suprema_active_ws_id', workspace.id);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      activeWorkspace,
      loading,
      login,
      sendOtp,
      verifyOtp,
      register,
      logout,
      switchWorkspace,
      isAuthenticated: !!user
    }}>
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
