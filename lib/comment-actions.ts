"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addComment(toolId: string, toolSlug: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to comment." };

  const trimmed = content.trim();
  if (!trimmed) return { error: "Comment cannot be empty." };

  const { error } = await supabase.from("tool_comments").insert({
    tool_id: toolId,
    user_id: user.id,
    content: trimmed,
  });

  if (error) return { error: error.message };
  revalidatePath(`/tool/${toolSlug}`);
  return { success: true };
}

export async function deleteComment(commentId: string, toolSlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("tool_comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath(`/tool/${toolSlug}`);
  return { success: true };
}

export type CommentRow = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
  profiles: { name: string | null; avatar_url: string | null } | { name: string | null; avatar_url: string | null }[] | null;
};

export async function getComments(toolId: string): Promise<CommentRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tool_comments")
    .select("id, user_id, content, created_at, upvotes, downvotes, profiles(name, avatar_url)")
    .eq("tool_id", toolId)
    .order("created_at", { ascending: false });
  return ((data ?? []) as unknown as CommentRow[]);
}
