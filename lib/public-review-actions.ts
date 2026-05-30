"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

async function getPrice(key: string): Promise<string> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("pricing_settings")
    .select("price")
    .eq("key", key)
    .single();
  return data?.price ?? "";
}

export async function submitPublicReview(url: string, tool_name: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const price_paid = await getPrice("public_review");

  const { error } = await supabase
    .from("public_review_requests")
    .insert({ user_id: user.id, url, price_paid, tool_name });
  if (error) return { error: error.message };
  revalidatePath("/dashboard/public-review");
  return { success: true };
}

export async function getUserPublicReviewRequests() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("public_review_requests")
    .select("id, url, tool_name, price_paid, status, rejection_note, submitted_at")
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false });
  if (error) return { error: error.message };
  return { data };
}

export async function getAllPublicReviewRequests() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.role !== "admin") return { error: "Unauthorized" };

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("public_review_requests")
    .select("id, url, tool_name, price_paid, status, rejection_note, submitted_at, user_id")
    .order("submitted_at", { ascending: false });
  if (error) return { error: error.message };
  return { data };
}

export async function updatePublicReviewStatus(
  id: number,
  status: "approved" | "rejected",
  rejectionNote?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.role !== "admin") return { error: "Unauthorized" };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("public_review_requests")
    .update({
      status,
      rejection_note: status === "rejected" ? (rejectionNote ?? null) : null,
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/public-review");
  return { success: true };
}

export async function updatePublicReviewRequest(
  id: number,
  data: { url: string; tool_name: string }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.role !== "admin") return { error: "Unauthorized" };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("public_review_requests")
    .update({ url: data.url, tool_name: data.tool_name })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/public-review");
  return { success: true };
}

export async function updateUserPublicReviewRequest(id: number, data: { url: string; tool_name: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("public_review_requests")
    .update({ url: data.url, tool_name: data.tool_name, status: "pending" })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/public-review");
  return { success: true };
}

export async function deleteUserPublicReviewRequest(id: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("public_review_requests").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/public-review");
  return { success: true };
}
