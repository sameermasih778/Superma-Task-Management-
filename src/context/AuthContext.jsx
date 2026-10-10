import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

/**
 * Cached session, kept in localStorage so a page refresh renders the signed-in
 * UI immediately instead of flashing the signed-out navbar.
 *
 * This is a rendering optimisation, never an authority: every protected request
 * still carries the JWT and the server re-validates it. The only local decision
 * is "is the token past its `exp`?", so an expired session can never be shown
 * as signed in.
 */
const USER_CACHE_KEY = 'suprema_user';
const WORKSPACE_CACHE_KEY = 'suprema_active_ws';

/** Read a JWT payload without verifying it - `exp` only. */
function tokenExpiresAt(storedToken) {
  try {
    const base64 = storedToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null; // unreadable payload - let the server decide
  }
}

function isTokenLive(storedToken) {
  if (!storedToken) return false;
  const expiresAt = tokenExpiresAt(storedToken);
  return expiresAt === null || expiresAt > Date.now();
}

function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Synchronous session bootstrap.
 *
 * Without this the provider starts every page load as "logged out" and only
 * learns the truth once /auth/me resolves. That produced two visible glitches on
 * every refresh: the navbar flashed "Sign In" before flipping to "Sign Out",
 * and protected routes flashed the "Authenticating Suprema Session..." screen.
 */
function readCachedSession() {
  const storedToken =
    sessionStorage.getItem('suprema_token') || localStorage.getItem('suprema_token') || null;

  if (!isTokenLive(storedToken)) {
    return { token: storedToken, user: null, activeWorkspace: null };
  }

  return {
    token: storedToken,
    user: readJson(USER_CACHE_KEY),
    activeWorkspace: readJson(WORKSPACE_CACHE_KEY)
  };
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => readCachedSession().token);
  const [user, setUser] = useState(() => readCachedSession().user);
  const [activeWorkspace, setActiveWorkspace] = useState(() => readCachedSession().activeWorkspace);
  // Nothing to wait for when a cached profile exists: render it now, then let
  // the background revalidation below keep it fresh.
  const [loading, setLoading] = useState(() => !readCachedSession().user);

  /** Persist the profile so the next load can paint the signed-in UI at once. */
  const cacheProfile = (userData, workspace = null) => {
    if (!userData) return;
    try {
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(userData));
      if (workspace) localStorage.setItem(WORKSPACE_CACHE_KEY, JSON.stringify(workspace));
    } catch {
      // Private mode / quota exceeded - the session still works, it just will
      // not survive a refresh without the flicker.
    }
  };

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
    // Portal preference is strictly constrained by actual user role:
    // Non-staff users ('member', 'viewer') CANNOT be flagged as 'admin'
    const isStaff = userData && ['super_admin', 'admin', 'developer'].includes(userData.role);
    const effectiveType = isStaff ? 'admin' : 'user';

    sessionStorage.setItem('suprema_login_type', effectiveType);
    localStorage.setItem('suprema_last_login_type', effectiveType);
  };

  /** Shared tail for every successful auth call: pick workspace, cache profile. */
  const adoptSession = (authToken, userData) => {
    setToken(authToken);
    setUser(userData);

    let workspace = null;
    if (userData?.workspaces && userData.workspaces.length > 0) {
      workspace = userData.workspaces[0];
      setActiveWorkspace(workspace);
      sessionStorage.setItem('suprema_active_ws_id', workspace.id);
      localStorage.setItem('suprema_active_ws_id', workspace.id);
    }

    cacheProfile(userData, workspace);
    setLoading(false);
  };

  // Initial Auth Verification on Page Load.
  // Runs after the first paint, so it only refreshes data - it no longer gates
  // what the user sees.
  useEffect(() => {
    const initAuth = async () => {
      const storedToken =
        sessionStorage.getItem('suprema_token') || localStorage.getItem('suprema_token');

      if (!isTokenLive(storedToken)) {
        // Expired or missing: clear it now instead of rendering a stale session.
        if (storedToken) logout();
        setLoading(false);
        return;
      }

      try {
        const data = await api.get('/auth/me');
        if (data.success && data.user) {
          setUser(data.user);
          persistSession(storedToken, data.user);

          // Keep the workspace the user last chose, else default to the first.
          let workspace = readJson(WORKSPACE_CACHE_KEY);
          if (data.user.workspaces && data.user.workspaces.length > 0) {
            const savedWsId =
              sessionStorage.getItem('suprema_active_ws_id') ||
              localStorage.getItem('suprema_active_ws_id');
            workspace =
              data.user.workspaces.find((w) => w.id === parseInt(savedWsId, 10)) ||
              data.user.workspaces[0];
            setActiveWorkspace(workspace);
          }
          cacheProfile(data.user, workspace);
        }
      } catch (err) {
        console.warn('Auth Session Expired or Invalid Token:', err.message);
        logout();
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Re-read the session when a profile picture changes.
   * Without this the sidebar keeps showing the previous avatar until a full
   * reload, because `user` is only hydrated once on mount.
   */
  useEffect(() => {
    const refresh = async () => {
      const storedToken =
        sessionStorage.getItem('suprema_token') || localStorage.getItem('suprema_token');
      if (!isTokenLive(storedToken)) return;

      try {
        const data = await api.get('/auth/me');
        if (data.success && data.user) {
          setUser(data.user);
          cacheProfile(data.user, readJson(WORKSPACE_CACHE_KEY));
        }
      } catch (err) {
        console.warn('Could not refresh profile:', err.message);
      }
    };

    window.addEventListener('suprema:profile-updated', refresh);
    return () => window.removeEventListener('suprema:profile-updated', refresh);
  }, []);

  const login = async (email, password, explicitLoginType = null) => {
    const data = await api.post('/auth/login', {
      email,
      password,
      portal: explicitLoginType
    });
    if (data.success && data.token) {
      persistSession(data.token, data.user, explicitLoginType);
      adoptSession(data.token, data.user);
      return data;
    }
    throw new Error(data.message || 'Login failed: Unexpected response from server');
  };

  /**
   * Sign in with a Google credential (Google Identity Services).
   *
   * The server verifies that credential against Google's public keys and
   * issues our own JWT, so from here on the session is identical to a password
   * login - including creating the account on first use.
   */
  const loginWithGoogle = async (credential) => {
    const data = await api.post('/auth/google', { credential });

    if (data.success && data.token) {
      // Google-authenticated accounts are always routed as members unless the
      // matched account is staff, which persistSession derives from the role.
      persistSession(data.token, data.user, 'user');
      adoptSession(data.token, data.user);
      return data;
    }
    throw new Error(data.message || 'Google sign-in failed');
  };

  const sendOtp = async (email) => {
    return await api.post('/auth/send-otp', { email });
  };

  const verifyOtp = async (name, email, password, otp) => {
    const data = await api.post('/auth/verify-otp', { name, email, password, otp });
    if (data.success && data.token) {
      persistSession(data.token, data.user, 'user');
      adoptSession(data.token, data.user);
      return data;
    }
  };

  const register = async (name, email, password) => {
    const data = await api.post('/auth/register', { name, email, password });
    if (data.success && data.token) {
      persistSession(data.token, data.user, 'user');
      adoptSession(data.token, data.user);
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
    localStorage.removeItem(USER_CACHE_KEY);
    localStorage.removeItem(WORKSPACE_CACHE_KEY);
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
      try {
        localStorage.setItem(WORKSPACE_CACHE_KEY, JSON.stringify(workspace));
      } catch {
        /* storage unavailable - workspace still applies for this tab */
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      activeWorkspace,
      loading,
      login,
      loginWithGoogle,
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