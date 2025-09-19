"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Input } from "@/components/ui/input";
import { signInAction, SigninFormState } from "@/app/actions/SignInAction";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function SigninForm() {
  // Define the initial state for the form
  const initialState: SigninFormState = {
    message: "",
    status: "idle",
  };

  // Hook up the server action to manage state
  const [state, formAction] = useActionState(signInAction, initialState);

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold text-center">Sign In</h2>

      <form className="space-y-4" action={formAction}>
        <div className="space-y-2">
          <label htmlFor="phone">Phone Number</label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Your phone number"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password">Password</label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <SubmitButton />

        {/* Display server error messages */}
        {state.message && state.status === "error" && (
          <p className="text-sm text-center text-red-500">{state.message}</p>
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
