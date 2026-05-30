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

export async function submitFeaturedAd(formData: { url: string; description: string; tool_name: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const price_paid = await getPrice("featured_spot");

  const { error } = await supabase.from("featured_ads").insert({
    user_id: user.id,
    url: formData.url,
    description: formData.description,
    tool_name: formData.tool_name,
    price_paid,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/featured-ad");
  return { success: true };
}

export async function updateFeaturedAdStatus(
  id: number,
  status: "approved" | "rejected",
  rejectionMessage?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.role !== "admin") return { error: "Unauthorized" };

  const { error } = await supabase
    .from("featured_ads")
    .update({
      status,
      approved_at: status === "approved" ? new Date().toISOString() : null,
      rejection_message: status === "rejected" ? (rejectionMessage ?? null) : null,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/featured-ads");
  revalidatePath("/");
  return { success: true };
}

export async function updateFeaturedAd(id: number, data: { url: string; description: string; tool_name: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.role !== "admin") return { error: "Unauthorized" };

  const { error } = await supabase
    .from("featured_ads")
    .update({ url: data.url, description: data.description, tool_name: data.tool_name })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/featured-ads");
  return { success: true };
}

export async function deleteFeaturedAd(id: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.role !== "admin") return { error: "Unauthorized" };

  const { error } = await supabase.from("featured_ads").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/featured-ads");
  revalidatePath("/");
  return { success: true };
}

export async function getApprovedFeaturedAds() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("featured_ads")
    .select("id, url, description, tool_name")
    .eq("status", "approved")
    .order("approved_at", { ascending: false });
  return data ?? [];
}

export async function updateUserFeaturedAd(id: number, data: { url: string; tool_name: string; description?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("featured_ads")
    .update({ url: data.url, tool_name: data.tool_name, ...(data.description !== undefined && { description: data.description }), status: "pending" })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/featured-ad");
  return { success: true };
}

export async function deleteUserFeaturedAd(id: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("featured_ads").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/featured-ad");
  return { success: true };
}
