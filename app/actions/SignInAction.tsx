"use server";
import { redirect } from "next/navigation";

export const SignInAction = async (formData: FormData) => {
  const credentials = Object.fromEntries(formData);
  redirect("/chat");
  console.log("SignInAction called with:", credentials);
};
