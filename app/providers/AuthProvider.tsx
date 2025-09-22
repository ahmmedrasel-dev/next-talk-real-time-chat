"use client";

import { ReactNode, useEffect, useState } from "react";

import { API_CONFIG, makeAuthenticatedRequest } from "../config/api";
import { AuthContext, AuthContextType, User } from "../context";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const error: string | null = null;

  // Load token and user data on initial render
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get token from localStorage
        const storedToken = localStorage.getItem("auth_token");
        if (!storedToken) {
          setLoading(false);
          return;
        }

        // token exists, attempt to load user

        // Try to get current user data from the API using the stored token
        const response = await makeAuthenticatedRequest(
          API_CONFIG.getEndpoint(API_CONFIG.endpoints.auth.me),
          {
            method: "GET",
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("LoadUserData Response:", data);
          if (data.success && data.data) {
            setUser(data.data);
          } else {
            console.log("Invalid user data response:", data);
          }
        } else {
          console.log("Failed to load user data, status:", response.status);
          // Token might be invalid, remove it
          localStorage.removeItem("auth_token");
        }
      } catch (err) {
        console.error("Error loading user data:", err);
        localStorage.removeItem("auth_token");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Function to load user data (can be called after signin)
  const loadUserData = async (): Promise<void> => {
    try {
      const response = await makeAuthenticatedRequest(
        API_CONFIG.getEndpoint(API_CONFIG.endpoints.auth.me),
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Manual LoadUserData Response:", data);
        if (data.success && data.data) {
          setUser(data.data);
        }
      }
    } catch (err) {
      console.error("Error loading user data manually:", err);
    }
  };

  // Expose setters so server actions (or client components that call server actions)
  // can update auth state after performing sign-in / sign-out on the server side.
  const setAuthUser = async (
    newUser: User | null,
    newToken?: string | null
  ) => {
    if (newToken) {
      localStorage.setItem("auth_token", newToken);
      // attempt to load user if not provided
      if (!newUser) {
        await loadUserData();
        return;
      }
    }

    setUser(newUser);
  };

  const clearAuth = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    error,
    setAuthUser,
    clearAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
