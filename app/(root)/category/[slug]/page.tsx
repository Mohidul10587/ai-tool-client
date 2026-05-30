import { createClient } from "@/lib/supabase/server";
import { getApprovedFeaturedAds } from "@/lib/featured-ads-actions";
import { CategoryPageClient } from "./client";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: subcategory } = await supabase
    .from("subcategories")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (!subcategory) notFound();

  const { data: tools } = await supabase
    .from("tool_submissions")
    .select("id, name, slug, overview, subcategory_snapshot, pricing, logo_url")
    .eq("status", "published")
    .eq("subcategory_id", subcategory.id)
    .not("name", "is", null)
    .order("updated_at", { ascending: false });

  const featuredAds = await getApprovedFeaturedAds();

  return (
    <CategoryPageClient
      subcategoryName={subcategory.name}
      tools={tools || []}
      featuredAds={featuredAds}
    />
  );
}
