import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminFeaturedAdsClient from "./client";

export default async function AdminFeaturedAdsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") redirect("/dashboard");

  const { data: ads } = await supabase
    .from("featured_ads")
    .select("id, url, description, tool_name, price_paid, status, rejection_message, submitted_at, user_id, logo_url")
    .order("submitted_at", { ascending: false });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Featured Ad Requests</h1>
      <AdminFeaturedAdsClient ads={ads ?? []} />
    </div>
  );
}
