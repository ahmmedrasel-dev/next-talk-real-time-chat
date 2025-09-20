"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/hooks/useAuth";

export default function SigninForm() {
  const router = useRouter();
  const { signIn, loading } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const success = await signIn(phone, password);

      if (success) {
        // Redirect to chat page on successful login
        router.push("/chat");
      } else {
        setErrorMessage("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold text-center">Sign In</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="phone">Phone Number</label>
          <Input
            id="phone"
            type="tel"
            placeholder="Your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password">Password</label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        {/* Display error messages */}
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
