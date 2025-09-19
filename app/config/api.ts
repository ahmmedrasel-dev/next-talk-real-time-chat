/**
 * Configuration utilities for the application
 * Contains environment variables and other configuration settings
 */

/**
 * API configuration
 */
export const API_CONFIG = {
  /**
   * Base API URL from environment variables
   */
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",

  /**
   * Get full API endpoint URL
   * @param path - The API path to append to the base URL
   * @returns Full API URL
   */
  getEndpoint: (path: string): string => {
    return `${API_CONFIG.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  },

  /**
   * API endpoints
   */
  endpoints: {
    auth: {
      signup: "/users/signup",
      signin: "/users/signin",
      signout: "/users/signout",
      refreshToken: "/users/refresh-token",
      me: "/users/me",
    },
    chat: {
      conversations: "/conversations",
      messages: "/messages",
    },
    // Add more endpoints as needed
  },
};

/**
 * Default fetch options
 */
export const DEFAULT_FETCH_OPTIONS: RequestInit = {
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Include cookies in requests
};
