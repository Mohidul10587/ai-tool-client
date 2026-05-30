import { createClient } from "@/lib/supabase/server";
import { HomePageClient } from "@/components/home-page-client";
import { getApprovedFeaturedAds } from "@/lib/featured-ads-actions";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ subcategory?: string }> }) {
  const supabase = await createClient();
  const { subcategory } = await searchParams;

  // Fetch ALL tools with proper null handling
  let query = supabase
    .from("tool_submissions")
    .select("id, name, slug, overview, subcategory_snapshot, pricing, logo_url, status")
    .eq("status", "published")
    .not("name", "is", null)
    .order("updated_at", { ascending: false });

  // Filter by subcategory if provided
  if (subcategory) {
    const { data: subcat } = await supabase
      .from("subcategories")
      .select("id")
      .eq("slug", subcategory)
      .single();
    
    if (subcat) {
      query = query.eq("subcategory_id", subcat.id);
    }
  }

  const { data: tools, error } = await query.limit(100);

  console.log("=== TOOLS DEBUG ===");
  console.log("Query error:", error);
  console.log("Tools found:", tools?.length);
  console.log("Tools:", tools);
  console.log("==================");

  // Fetch categories for filter
  const { data: categories } = await supabase
    .from("categories")
    .select("*, subcategories(*)")
    .order("display_order");

  const featuredAds = await getApprovedFeaturedAds();

  return <HomePageClient tools={tools || []} categories={categories || []} selectedSubcategory={subcategory} featuredAds={featuredAds} />;
}
