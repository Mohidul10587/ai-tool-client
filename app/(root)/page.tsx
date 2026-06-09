import { createClient } from "@/lib/supabase/server";
import { HomePageClient } from "@/components/home-page-client";
import { getApprovedFeaturedAds } from "@/lib/featured-ads-actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Discover and compare the best AI tools. Browse hundreds of AI tools by category, pricing, and use case.",
};

export default async function HomePage({ searchParams }: { searchParams: Promise<{ subcategory?: string }> }) {
  const supabase = await createClient();
  const { subcategory } = await searchParams;

  let query = supabase
    .from("tool_submissions")
    .select("id, name, slug, overview, subcategory_snapshot, pricing, logo_url, url")
    .eq("status", "published")
    .not("name", "is", null)
    .order("updated_at", { ascending: false });

  if (subcategory) {
    const { data: subcat } = await supabase
      .from("subcategories")
      .select("id")
      .eq("slug", subcategory)
      .single();
    if (subcat) query = query.eq("subcategory_id", subcat.id);
  }

  const { data: tools } = await query.limit(100);

  // Try to fetch vote counts (only works after migration)
  let voteMap: Record<string, 1 | -1> = {};
  let voteCounts: Record<string, { upvotes: number; downvotes: number }> = {};

  if (tools?.length) {
    const ids = tools.map((t) => t.id);

    const [votesRes, { data: { user } }] = await Promise.all([
      supabase.from("tool_submissions").select("id, upvotes, downvotes").in("id", ids),
      supabase.auth.getUser(),
    ]);

    if (!votesRes.error) {
      voteCounts = Object.fromEntries(
        (votesRes.data ?? []).map((t) => [t.id, { upvotes: t.upvotes ?? 0, downvotes: t.downvotes ?? 0 }])
      );

      if (user) {
        const { data: userVotes } = await supabase
          .from("tool_votes")
          .select("tool_id, vote")
          .eq("user_id", user.id)
          .in("tool_id", ids);
        voteMap = Object.fromEntries((userVotes ?? []).map((v) => [v.tool_id, v.vote]));
      }
    }
  }

  const toolsWithVotes = (tools ?? []).map((t) => ({
    ...t,
    upvotes: voteCounts[t.id]?.upvotes ?? 0,
    downvotes: voteCounts[t.id]?.downvotes ?? 0,
    userVote: voteMap[t.id] ?? null,
  }));

  const [categories, featuredAds] = await Promise.all([
    supabase.from("categories").select("*, subcategories(*)").order("display_order").then(({ data }) => data ?? []),
    getApprovedFeaturedAds(),
  ]);

  return <HomePageClient tools={toolsWithVotes} categories={categories} selectedSubcategory={subcategory} featuredAds={featuredAds} />;
}
