"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { signupAction, SignupFormState } from "@/app/actions/SignupAction";
import { SubmitButton } from "@/components/ui/SubmitButton";
import Form from "next/form";

export default function SignupForm() {
  const router = useRouter();

  // 1. Define the initial state for the form, now with status
  const initialState: SignupFormState = {
    message: "",
    status: "idle",
    errors: {},
    formData: {},
  };

  const [state, formAction] = useActionState(signupAction, initialState);

  useEffect(() => {
    if (state.status === "success") {
      const timer = setTimeout(() => {
        router.push("/signin");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [state, router]);

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold text-center">Create an Account</h2>

      <Form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="full_name" className="text-sm font-medium">
            Full Name
          </label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            required
            defaultValue={state.formData?.full_name || ""}
            className={state.errors?.full_name ? "border-red-500" : ""}
          />
          {state.errors?.full_name && (
            <p className="text-xs text-red-500">{state.errors.full_name}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            defaultValue={state.formData?.phone || ""}
            className={state.errors?.phone ? "border-red-500" : ""}
          />
          {state.errors?.phone && (
            <p className="text-xs text-red-500">{state.errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            className={state.errors?.password ? "border-red-500" : ""}
          />
          {state.errors?.password && (
            <p className="text-xs text-red-500">{state.errors.password}</p>
          )}
        </div>

        <SubmitButton />

        {/* Conditionally render message style based on status */}
        {state.message && state.status !== "error" && (
          <p className="text-sm text-center text-green-500">{state.message}</p>
        )}
      </Form>
      <div className="text-sm text-center">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-medium text-blue-600 hover:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
