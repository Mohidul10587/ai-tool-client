import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminFeaturedAdsClient from "./client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Featured Ad Requests</h1>
        <Link href="/admin/add-featured-ad">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Featured Ad
          </Button>
        </Link>
      </div>
      <AdminFeaturedAdsClient ads={ads ?? []} />
    </div>
  );
}
