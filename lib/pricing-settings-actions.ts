"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { PricingItem } from "@/lib/pricing-settings";

export async function savePricingSettings(items: PricingItem[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.role !== "admin") return { error: "Unauthorized" };

  const admin = createAdminClient();
  const { error } = await admin
    .from("pricing_settings")
    .upsert(items, { onConflict: "key" });

  if (error) return { error: error.message };
  revalidatePath("/pricing");
  revalidatePath("/admin/pricing-settings");
  return { success: true };
}
