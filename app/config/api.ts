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
      signin: "/users/login",
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
};

/**
 * Make an authenticated API request
 * @param url - The API endpoint URL
 * @param options - Fetch options
 * @returns Fetch response
 */
export const makeAuthenticatedRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const makeRequest = async (token?: string | null) => {
    const headers = {
      ...DEFAULT_FETCH_OPTIONS.headers,
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    return fetch(url, {
      ...DEFAULT_FETCH_OPTIONS,
      ...options,
      headers,
    });
  };

  // Attempt initial request with current token
  const token = localStorage.getItem("auth_token");
  let res = await makeRequest(token);

  // If unauthorized, try to refresh token and retry once
  if (res.status === 401) {
    try {
      const refreshRes = await fetch(
        API_CONFIG.getEndpoint(API_CONFIG.endpoints.auth.refreshToken),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // include credentials in case refresh token uses httpOnly cookie
          credentials: "include",
        }
      );

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        if (refreshData?.data?.token) {
          localStorage.setItem("auth_token", refreshData.data.token);
          // retry original request with new token
          res = await makeRequest(refreshData.data.token);
        }
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
    }
  }

  return res;
};
