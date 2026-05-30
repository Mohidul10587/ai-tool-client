"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.role !== "admin") throw new Error("Unauthorized");
  return { supabase, user };
}

export async function changeUserRole(userId: string, role: "user" | "admin") {
  try { await requireAdmin(); } catch { return { error: "Unauthorized" }; }
  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.updateUserById(userId, { user_metadata: { role } });
  if (error) return { error: error.message };
  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  try { await requireAdmin(); } catch { return { error: "Unauthorized" }; }
  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };
  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateAdminProfile(formData: FormData) {
  const { supabase, user } = await requireAdmin().catch(() => { throw new Error("Unauthorized"); });
  const name = (formData.get("name") as string) || user.user_metadata?.name;
  const avatarUrl = formData.get("avatar_url") as string;
  const updateData: Record<string, string> = { name };
  if (avatarUrl) updateData.avatar_url = avatarUrl;
  const { error } = await supabase.auth.updateUser({ data: updateData });
  if (error) return { error: error.message };
  revalidatePath("/admin/settings");
  return { success: true };
}

export async function updateUserPassword(userId: string, password: string) {
  try { await requireAdmin(); } catch { return { error: "Unauthorized" }; }
  if (password.length < 6) return { error: "Password must be at least 6 characters" };
  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.updateUserById(userId, { password });
  if (error) return { error: error.message };
  return { success: true };
}

export async function updateAdminPassword(formData: FormData) {
  const { supabase } = await requireAdmin().catch(() => { throw new Error("Unauthorized"); });
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;
  if (password !== confirm) return { error: "Passwords do not match" };
  if (password.length < 6) return { error: "Password must be at least 6 characters" };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { success: true };
}
