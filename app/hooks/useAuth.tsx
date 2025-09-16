import { useContext } from "react";
import { AuthContext } from "../context";

type user = {
  name: string;
  email: string;
};

type AuthContextType = {
  user: user | null;
  loading: boolean;
  signIn: () => void;
  signOut: () => void;
};

export const useAuth = () => {
  const context = useContext(AuthContext) as AuthContextType | null;

  if (!context || !context.user) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user, loading, signIn, signOut } = context;
  return { user, loading, signIn, signOut };
};
