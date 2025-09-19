"use server";

import { z } from "zod";

// 1. Define the shape of the state object, now with a status and field-specific errors
export interface SignupFormState {
  message: string;
  status: "success" | "error" | "idle";
  errors?: {
    full_name?: string;
    phone?: string;
    password?: string;
  };
  formData?: {
    full_name?: string;
    phone?: string;
  };
}

// 2. Zod schema remains the same
const signupSchema = z.object({
  full_name: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters long." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

// 3. Update the Server Action to return status
export async function signupAction(
  prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { message: "API URL is not configured.", status: "error" };
  }

  const data = Object.fromEntries(formData.entries());
  const validatedFields = signupSchema.safeParse(data);

  if (!validatedFields.success) {
    // Create field-specific error messages
    const fieldErrors: Record<string, string> = {};

    validatedFields.error.issues.forEach((issue) => {
      const path = issue.path[0] as string;
      fieldErrors[path] = issue.message;
    });

    // Return the error state with field-specific errors and preserve form data
    return {
      message: "Please correct the errors below",
      status: "error",
      errors: fieldErrors,
      formData: {
        full_name: data.full_name as string,
        phone: data.phone as string,
      },
    };
  }

  try {
    const response = await fetch(`${apiUrl}/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedFields.data),
    });

    const result = await response.json();

    if (!response.ok) {
      // For API errors, preserve the form data
      return {
        message: result.message || "Something went wrong.",
        status: "error",
        formData: {
          full_name: validatedFields.data.full_name,
          phone: validatedFields.data.phone,
        },
      };
    }

    // On success, return a success message and status instead of redirecting
    return {
      message: "Account created successfully! You will be redirected shortly.",
      status: "success",
    };
  } catch (error) {
    console.error("Signup Error:", error);
    // For network errors, also preserve form data
    return {
      message: "Could not connect to the server. Please try again.",
      status: "error",
      formData: {
        full_name: validatedFields.data.full_name,
        phone: validatedFields.data.phone,
      },
    };
  }
}
