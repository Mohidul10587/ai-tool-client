"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function submitTool(url: string, tool_name?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("tool_submissions").insert({ user_id: user.id, url, name: tool_name });
  if (error) return { error: error.message };
  return { success: true };
}

export async function getUserSubmissions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("tool_submissions")
    .select("id, url, name, category_id, subcategory_id, category_snapshot, subcategory_snapshot, pricing, overview, status, submitted_at, updated_at, tags")
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false });
  if (error) return { error: error.message };
  return { data };
}

export async function updateSubmissionUrl(id: string, url: string, name?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("tool_submissions")
    .update({ url, ...(name !== undefined && { name }), status: "pending" })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/submissions");
  return { success: true };
}

export async function deleteUserSubmission(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("tool_submissions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/submissions");
  return { success: true };
}

export async function updateSubmission(id: string, fields: Record<string, unknown>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.role !== "admin") return { error: "Unauthorized" };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("tool_submissions")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/submissions");
  return { success: true };
}

export async function deleteSubmission(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.role !== "admin") return { error: "Unauthorized" };

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("tool_submissions").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/submissions");
  return { success: true };
}

export async function getAllSubmissions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.role !== "admin") return { error: "Unauthorized" };

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("tool_submissions")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (error) return { error: error.message };
  return { data };
}
