import { createClient } from "@/lib/supabase/server";
import { HomePageClient } from "@/components/home-page-client";
import { getApprovedFeaturedAds } from "@/lib/featured-ads-actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Discover and compare the best AI tools. Browse hundreds of AI tools by category, pricing, and use case.",
};

const PAGE_SIZE = 20;

export default async function HomePage({ searchParams }: { searchParams: Promise<{ subcategory?: string; page?: string }> }) {
  const supabase = await createClient();
  const { subcategory, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let subcategoryId: string | null = null;
  if (subcategory) {
    const { data: subcat } = await supabase
      .from("subcategories")
      .select("id")
      .eq("slug", subcategory)
      .single();
    subcategoryId = subcat?.id ?? null;
  }

  let query = supabase
    .from("tool_submissions")
    .select("id, name, slug, overview, subcategory_snapshot, pricing, logo_url, url, upvotes, downvotes", { count: "exact" })
    .eq("status", "published")
    .not("name", "is", null)
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (subcategoryId) query = query.eq("subcategory_id", subcategoryId);

  const { data: tools, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  // Fetch user votes for visible tools
  let voteMap: Record<string, 1 | -1> = {};
  if (tools?.length) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: userVotes } = await supabase
        .from("tool_votes")
        .select("tool_id, vote")
        .eq("user_id", user.id)
        .in("tool_id", tools.map((t) => t.id));
      voteMap = Object.fromEntries((userVotes ?? []).map((v) => [v.tool_id, v.vote]));
    }
  }

  const toolsWithVotes = (tools ?? []).map((t) => ({
    ...t,
    upvotes: t.upvotes ?? 0,
    downvotes: t.downvotes ?? 0,
    userVote: voteMap[t.id] ?? null,
  }));

  const [categories, featuredAds] = await Promise.all([
    supabase.from("categories").select("*, subcategories(*)").order("display_order").then(({ data }) => data ?? []),
    getApprovedFeaturedAds(),
  ]);

  return (
    <HomePageClient
      tools={toolsWithVotes}
      categories={categories}
      selectedSubcategory={subcategory}
      featuredAds={featuredAds}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
