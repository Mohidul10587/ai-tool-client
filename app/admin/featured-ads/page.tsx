import { createClient } from "@/lib/supabase/server";
import AdminFeaturedAdsClient from "./client";

export default async function AdminFeaturedAdsPage() {
  const supabase = await createClient();
  const { data: ads } = await supabase
    .from("featured_ads")
    .select("id, url, description, tool_name, price_paid, status, rejection_message, submitted_at, user_id, logo_url")
    .order("submitted_at", { ascending: false });

  return <AdminFeaturedAdsClient ads={ads ?? []} />;
}
