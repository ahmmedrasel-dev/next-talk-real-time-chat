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
  signIn: (phone: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  signIn: async () => false,
  signOut: async () => {},
});
