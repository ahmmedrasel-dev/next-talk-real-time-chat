"use client";

import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  removeTokens,
} from "./token";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Function to refresh the access token
const refreshToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const res = await fetch(`${API_URL}/users/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      throw new Error("Failed to refresh token.");
    }

    const { accessToken, refreshToken: newRefreshToken } = await res.json();
    setTokens(accessToken, newRefreshToken); // Save new tokens
    return accessToken;
  } catch (error) {
    console.error("Token refresh error:", error);
    removeTokens(); // Clear tokens on refresh failure
    window.location.href = "/signin"; // Redirect to signin
    return null;
  }
};

// Custom fetch wrapper
export const api = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAccessToken();

  // Add authorization header
  options.headers = {
    ...(typeof options.headers === "object" && !Array.isArray(options.headers)
      ? options.headers
      : {}),
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  } as Record<string, string>;

  // Initial request
  let response = await fetch(`${API_URL}${url}`, options);

  // If response is 401 (Unauthorized), try to refresh the token
  if (response.status === 401) {
    const newAccessToken = await refreshToken();

    if (newAccessToken) {
      // Retry the request with the new token
      (options.headers as Record<string, string>)[
        "Authorization"
      ] = `Bearer ${newAccessToken}`;
      response = await fetch(`${API_URL}${url}`, options);
    }
  }

  return response;
};
