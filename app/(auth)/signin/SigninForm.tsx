"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInAction } from "@/app/actions/SignInAction";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setTokens } from "@/lib/token"; // Import token setter
import { api } from "@/lib/api"; // Import custom api client
import { useAuth } from "@/app/hooks/useAuth";

export default function SigninForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAuthUser } = useAuth(); // Get setUser from context
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Step 1: Call server action to get tokens
      const formData = new FormData(e.currentTarget);
      const result = await signInAction(formData);

      if (!result.success || !result.data) {
        throw new Error(result.message || "Sign-in action failed.");
      }

      const { accessToken, refreshToken } = result.data;

      // Step 2: Set tokens in local storage
      setTokens(accessToken, refreshToken);

      // Step 3: Fetch user data using the new token
      const response = await api("/users/me", { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to fetch user profile after login.");
      }
      const userData = await response.json();

      // Step 4: Set user data in global context
      setAuthUser(userData);

      // Step 5: Navigate to the chat page
      router.push("/chat");
    } catch (error: any) {
      console.error("Login process failed:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold text-center">Sign In</h2>
      <form className="space-y-4" onSubmit={onSubmit}>
        {/* Your form inputs (phone, password) */}
        <div className="space-y-2">
          <label htmlFor="phone">Phone Number</label>
          <Input id="phone" name="phone" type="tel" required />
        </div>
        <div className="space-y-2">
          <label htmlFor="password">Password</label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
        {errorMessage && (
          <p className="text-sm text-center text-red-500">{errorMessage}</p>
        )}
      </form>
      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
