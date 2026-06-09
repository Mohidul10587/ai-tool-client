import type { Metadata } from "next";
import LoginPageClient from "./client";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your AI Directory account to manage your tool submissions and featured ads.",
};

export default function LoginPage() {
  return <LoginPageClient />;
}
