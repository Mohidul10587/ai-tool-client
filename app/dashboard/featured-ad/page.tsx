import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DashboardFeaturedAdClient } from "./client";

export default async function DashboardFeaturedAdPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: ads } = await supabase
    .from("featured_ads")
    .select("id, url, description, tool_name, price_paid, status, rejection_message, submitted_at")
    .eq("user_id", user?.id)
    .order("submitted_at", { ascending: false });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Featured Ad Requests</h1>
        <Link href="/pricing" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">+ New Request</Link>
      </div>
      {!ads?.length ? (
        <p className="text-gray-500">No requests yet. <Link href="/pricing" className="text-gray-900 underline">Submit one</Link>.</p>
      ) : (
        <DashboardFeaturedAdClient ads={ads} />
      )}
    </div>
  );
}
