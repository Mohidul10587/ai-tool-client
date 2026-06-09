import type { Metadata } from "next";
import RegisterPageClient from "./client";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a free AI Directory account to submit tools, leave reviews, and manage featured ads.",
};

export default function RegisterPage() {
  return <RegisterPageClient />;
}
