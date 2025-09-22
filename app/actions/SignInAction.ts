"use server";

export type SignInResult = {
  success: boolean;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
  message?: string;
};

export async function signInAction(formData: FormData): Promise<SignInResult> {
  const credentials = {
    phone: formData.get("phone") as string | null,
    password: formData.get("password") as string | null,
  };
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    // Note: This initial sign-in does not use the `api` wrapper
    const res = await fetch(`${apiUrl}/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const responseData = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: responseData.message || "Signin failed",
      };
    }

    // Expecting { accessToken, refreshToken } from the API
    return { success: true, data: responseData };
  } catch (error) {
    return { success: false, message: "An unexpected network error occurred." };
  }
}
