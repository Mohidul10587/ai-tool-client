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

  const featuredAds = await getApprovedFeaturedAds();

  return (
    <CategoryPageClient
      subcategoryName={subcategory.name}
      tools={toolsWithVotes}
      featuredAds={featuredAds}
    />
  );
}
