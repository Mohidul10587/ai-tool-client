"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function voteOnTool(
  toolId: string,
  vote: 1 | -1
): Promise<{ upvotes: number; downvotes: number; userVote: 1 | -1 | null; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { upvotes: 0, downvotes: 0, userVote: null, error: "Login required" };

  // Check existing vote
  const { data: existing } = await supabase
    .from("tool_votes")
    .select("id, vote")
    .eq("tool_id", toolId)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    if (existing.vote === vote) {
      // Same vote → remove it
      await supabase.from("tool_votes").delete().eq("id", existing.id);
    } else {
      // Different vote → update
      await supabase.from("tool_votes").update({ vote }).eq("id", existing.id);
    }
  } else {
    await supabase.from("tool_votes").insert({ tool_id: toolId, user_id: user.id, vote });
  }

  // Fetch updated counts
  const { data: tool } = await supabase
    .from("tool_submissions")
    .select("upvotes, downvotes")
    .eq("id", toolId)
    .single();

  const { data: myVote } = await supabase
    .from("tool_votes")
    .select("vote")
    .eq("tool_id", toolId)
    .eq("user_id", user.id)
    .single();

  revalidatePath("/");
  return {
    upvotes: tool?.upvotes ?? 0,
    downvotes: tool?.downvotes ?? 0,
    userVote: (myVote?.vote as 1 | -1) ?? null,
  };
}

export async function getToolVote(toolId: string): Promise<1 | -1 | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("tool_votes")
    .select("vote")
    .eq("tool_id", toolId)
    .eq("user_id", user.id)
    .single();
  return (data?.vote as 1 | -1) ?? null;
}
