import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

  const userIds = [...new Set(comments.map((c) => c.user_id))];

  // Try profiles table first, fall back to auth.users metadata
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name, avatar_url")
    .in("id", userIds);

  let profileMap: Record<string, { name: string | null; avatar_url: string | null }> =
    Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));

  // For any users not in profiles, fetch from auth.users
  const missingIds = userIds.filter((id) => !profileMap[id]);
  if (missingIds.length > 0) {
    const adminClient = createAdminClient();
    const { data: { users } } = await adminClient.auth.admin.listUsers();
    for (const u of users ?? []) {
      if (missingIds.includes(u.id)) {
        profileMap[u.id] = {
          name: u.user_metadata?.name ?? u.user_metadata?.full_name ?? u.email ?? null,
          avatar_url: u.user_metadata?.avatar_url ?? null,
        };
      }
    }
  }

  const result = comments.map((c) => ({
    ...c,
    profiles: profileMap[c.user_id] ?? { name: "User", avatar_url: null },
  }));

  return NextResponse.json(result);
}
