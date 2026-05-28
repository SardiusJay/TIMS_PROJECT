'use client';

import React, { createContext, useCallback, useEffect, useState } from 'react';
import { User, LoginRequest } from '@/types/api';
import { apiClient } from '@/lib/api';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  signup: (userData: { email: string; name: string; password: string; phone?: string }) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  clearError: () => void;
  hasRole: (roles: string | string[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (apiClient.isAuthenticated()) {
          const currentUser = await apiClient.get<User>('/auth/me');
          setUser(currentUser);
        }
      } catch (err: any) {
        apiClient.clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<any>('/auth/login', credentials);
      apiClient.setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    apiClient.clearTokens();
    setError(null);
  }, []);

  const signup = useCallback(async (userData: { email: string; name: string; password: string; phone?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<any>('/auth/signup', userData);
      apiClient.setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Signup failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/auth/forgot-password', { email });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to send reset email';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/auth/reset-password', { token, password });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to reset password';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const hasRole = useCallback(
    (roles: string | string[]) => {
      if (!user) return false;
      const roleArray = Array.isArray(roles) ? roles : [roles];
      return roleArray.includes(user.role);
    },
    [user]
  );

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    signup,
    forgotPassword,
    resetPassword,
    clearError,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
