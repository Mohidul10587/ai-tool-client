"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function saveSiteSettings(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.role !== "admin") return { error: "Unauthorized" };

  const keys = [
    "site_title", "site_description", "site_keywords",
    "logo_url", "favicon_url", "og_image_url",
    "twitter_handle", "google_verification", "footer_text",
    "social_twitter", "social_facebook", "social_linkedin", "social_email",
  ];

  const rows = keys.map((key) => ({
    key,
    value: (formData.get(key) as string) ?? "",
    updated_at: new Date().toISOString(),
  }));

  const admin = createAdminClient();
  const { error } = await admin
    .from("site_settings")
    .upsert(rows, { onConflict: "key" });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/admin/site-settings");
  return { success: true };
}
