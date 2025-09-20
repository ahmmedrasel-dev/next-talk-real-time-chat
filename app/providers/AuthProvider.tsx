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
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

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

        setToken(storedToken);

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
          setToken(null);
        }
      } catch (err) {
        console.error("Error loading user data:", err);
        localStorage.removeItem("auth_token");
        setToken(null);
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

  const signIn = async (phone: string, password: string): Promise<boolean> => {
    console.log("Starting signIn process...");
    setLoading(true);
    setError(null);

    try {
      // Call your API endpoint
      const response = await fetch(
        API_CONFIG.getEndpoint(API_CONFIG.endpoints.auth.signin),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, password }),
        }
      );

      console.log("SignIn response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log("SignIn error data:", errorData);
        setError(errorData.message || "Login failed");
        return false;
      }

      const data = await response.json();
      console.log("SignIn Response:", data);

      if (data.success && data.data?.token) {
        console.log(
          "Token received:",
          data.data.token.substring(0, 20) + "..."
        );

        // Store token in localStorage
        localStorage.setItem("auth_token", data.data.token);
        setToken(data.data.token);

        // Set user data if available in signin response
        if (data.data.user) {
          setUser(data.data.user);
          console.log("User set from signin:", data.data.user);
        } else {
          console.log(
            "No user data in signin response, loading from /me endpoint"
          );
          // Load user data from /me endpoint
          await loadUserData();
        }

        console.log("SignIn completed successfully");
        return true;
      }

      console.log("Invalid signin response structure:", data);
      setError("Invalid response from server");
      return false;
    } catch (err) {
      console.error("Sign in error:", err);
      setError("Network error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      // Send signout request with token if available
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      await fetch(API_CONFIG.getEndpoint(API_CONFIG.endpoints.auth.signout), {
        method: "POST",
        headers,
      });
    } catch (error) {
      console.error("Error during sign out:", error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem("auth_token");
      setToken(null);
      setUser(null);
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
