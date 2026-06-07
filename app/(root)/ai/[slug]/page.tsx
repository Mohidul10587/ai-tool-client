import { createClient } from "@/lib/supabase/server";
import { getApprovedFeaturedAds } from "@/lib/featured-ads-actions";
import { ToolDetailsClient } from "./client";
import { notFound } from "next/navigation";

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: tool } = await supabase
    .from("tool_submissions")
    .select("id, name, slug, overview, subcategory_snapshot, pricing, logo_url, hero_image_url, url, key_features, use_cases, pricing_info, pros, cons, platform, short_description, detail_description")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!tool) notFound();

  const [featuredAds, { data: { user } }] = await Promise.all([
    getApprovedFeaturedAds(),
    supabase.auth.getUser(),
  ]);

  const { data: voteCount } = await supabase
    .from("tool_submissions")
    .select("upvotes, downvotes")
    .eq("id", tool.id)
    .single();

  let userVote: 1 | -1 | null = null;
  if (user) {
    const { data: v } = await supabase
      .from("tool_votes")
      .select("vote")
      .eq("tool_id", tool.id)
      .eq("user_id", user.id)
      .single();
    userVote = (v?.vote as 1 | -1) ?? null;
  }

  return (
    <ToolDetailsClient
      tool={tool}
      featuredAds={featuredAds}
      currentUser={user ? { id: user.id, name: user.user_metadata?.name ?? "User", avatar_url: user.user_metadata?.avatar_url ?? null } : null}
      initialUpvotes={voteCount?.upvotes ?? 0}
      initialDownvotes={voteCount?.downvotes ?? 0}
      initialUserVote={userVote}
    />
  );
}
