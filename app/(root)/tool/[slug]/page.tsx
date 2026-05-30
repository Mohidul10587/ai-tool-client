import { createClient } from "@/lib/supabase/server";
import { getApprovedFeaturedAds } from "@/lib/featured-ads-actions";
import { ToolDetailsClient } from "./client";
import { notFound } from "next/navigation";

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: tool } = await supabase
    .from("tool_submissions")
    .select("id, name, slug, overview, subcategory_snapshot, pricing, logo_url, hero_image_url, url, key_features, use_cases, pricing_info, pros, cons, platform")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!tool) notFound();

  const featuredAds = await getApprovedFeaturedAds();

  return <ToolDetailsClient tool={tool} featuredAds={featuredAds} />;
}
