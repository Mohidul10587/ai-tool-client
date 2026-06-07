import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const toolId = req.nextUrl.searchParams.get("toolId");
  if (!toolId) return NextResponse.json([]);

  const supabase = await createClient();

  const { data: comments } = await supabase
    .from("tool_comments")
    .select("id, user_id, content, created_at, upvotes, downvotes")
    .eq("tool_id", toolId)
    .order("created_at", { ascending: false });

  if (!comments?.length) return NextResponse.json([]);

  // Fetch profile names separately via profiles table
  const userIds = [...new Set(comments.map((c) => c.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name, avatar_url")
    .in("id", userIds);

  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));

  const result = comments.map((c) => ({
    ...c,
    profiles: profileMap[c.user_id] ?? { name: "User", avatar_url: null },
  }));

  return NextResponse.json(result);
}
