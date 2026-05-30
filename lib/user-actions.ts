"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const name = (formData.get("name") as string) || user.user_metadata?.name;
  const avatarUrl = formData.get("avatar_url") as string;

  const updateData: Record<string, string> = { name };
  if (avatarUrl) updateData.avatar_url = avatarUrl;

  const { error } = await supabase.auth.updateUser({ data: updateData });
  if (error) return { error: error.message };
  revalidatePath("/dashboard/profile");
  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;
  if (password !== confirm) return { error: "Passwords do not match" };
  if (password.length < 6) return { error: "Password must be at least 6 characters" };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { success: true };
}
