"use client";

import { createContext } from "react";

// Define the User type
export type User = {
  id: string;
  full_name?: string;
  phone?: string;
  photoUrl?: string;
};

// Define the AuthContext type
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  // Client-side setters: server actions will call these (via client components)
  setAuthUser: (user: User | null, token?: string | null) => void;
  clearAuth: () => void;
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  setAuthUser: () => {},
  clearAuth: () => {},
});
