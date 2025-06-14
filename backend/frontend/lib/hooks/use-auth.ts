'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '@/lib/contexts/TenantContext';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'owner' | 'user';
  avatar_url?: string;
  created_at: string;
}

export interface AuthSession {
  access_token: string;
  user: User;
  expires_at: number;
}

interface UseAuthReturn {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  refreshSession: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  tenantName: string;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { tenantSlug } = useTenant();

  const isAuthenticated = !!user && !!session;

  // Get auth headers with tenant context
  const getAuthHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    if (tenantSlug) {
      headers['X-Tenant-ID'] = tenantSlug;
    }

    return headers;
  }, [session?.access_token, tenantSlug]);

  // Load session from localStorage
  const loadSession = useCallback(() => {
    try {
      const storedSession = localStorage.getItem('auth_session');
      if (storedSession) {
        const parsedSession: AuthSession = JSON.parse(storedSession);
        
        // Check if session is expired
        if (parsedSession.expires_at > Date.now()) {
          setSession(parsedSession);
          setUser(parsedSession.user);
        } else {
          // Session expired, clear it
          localStorage.removeItem('auth_session');
        }
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      localStorage.removeItem('auth_session');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save session to localStorage
  const saveSession = useCallback((newSession: AuthSession) => {
    try {
      localStorage.setItem('auth_session', JSON.stringify(newSession));
      setSession(newSession);
      setUser(newSession.user);
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }, []);

  // Clear session
  const clearSession = useCallback(() => {
    localStorage.removeItem('auth_session');
    setSession(null);
    setUser(null);
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.error?.message || 'Login failed',
        };
      }

      // Create session with expiration
      const newSession: AuthSession = {
        access_token: data.session.access_token,
        user: data.user,
        expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
      };

      saveSession(newSession);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }
  }, [getAuthHeaders, saveSession]);

  // Register function
  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error?.message || 'Registration failed',
        };
      }

      // Create session with expiration
      const newSession: AuthSession = {
        access_token: result.session.access_token,
        user: result.user,
        expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
      };

      saveSession(newSession);

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }
  }, [saveSession]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      if (session?.access_token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: getAuthHeaders(),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearSession();
    }
  }, [session?.access_token, getAuthHeaders, clearSession]);

  // Refresh session
  const refreshSession = useCallback(async () => {
    if (!session?.access_token) return;

    try {
      const response = await fetch('/api/auth/profile', {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          const updatedSession: AuthSession = {
            ...session,
            user: data.user,
          };
          saveSession(updatedSession);
        }
      } else if (response.status === 401) {
        // Session invalid, clear it
        clearSession();
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
    }
  }, [session, getAuthHeaders, saveSession, clearSession]);

  // Load session on mount
  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Refresh session periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      refreshSession();
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, refreshSession]);

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    refreshSession,
  };
}