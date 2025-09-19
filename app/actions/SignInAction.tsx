"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Define the shape of the state object for the form
export interface SigninFormState {
  message: string;
  status: "error" | "success" | "idle";
}

// Zod schema for validating login data
const signinSchema = z.object({
  phone: z.string().min(1, { message: "Phone number is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export async function signInAction(
  prevState: SigninFormState,
  formData: FormData
): Promise<SigninFormState> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { message: "API URL is not configured.", status: "error" };
  }

  // 1. Extract and validate form data
  const data = Object.fromEntries(formData.entries());
  const validatedFields = signinSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues[0].message,
      status: "error",
    };
  }

  // 2. Call the backend API
  try {
    const response = await fetch(`${apiUrl}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedFields.data),
    });

    const result = await response.json();

    // If API returns an error (e.g., invalid credentials)
    if (!response.ok || !result.success) {
      return {
        message: result.message || "Invalid credentials.",
        status: "error",
      };
    }

    // 3. On success, set the tokens in secure cookies
    const { token, refreshToken } = result.data;
    if (token && refreshToken) {
      cookies().set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
      cookies().set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
    } else {
      return {
        message: "Login successful, but no token was received.",
        status: "error",
      };
    }
  } catch (error) {
    console.error("Sign In Error:", error);
    return {
      message: "Could not connect to the server. Please try again.",
      status: "error",
    };
  }

  // 4. Redirect to the chat page on success
  redirect("/chat");
}
