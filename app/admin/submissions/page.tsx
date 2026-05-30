import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { UserSubmissionsList } from "@/components/user-submissions-list";

export default async function AdminMySubmissionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") redirect("/dashboard");

  const adminClient = createAdminClient();
  const { data: submissions } = await adminClient
    .from("tool_submissions")
    .select("id, url, name, category, pricing, overview, status, submitted_at, updated_at")
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false });

  return (
    <div className="space-y-4 max-w-4xl">
      <h2 className="text-xl font-semibold">My Submitted Tools ({submissions?.length ?? 0})</h2>
      <UserSubmissionsList submissions={submissions ?? []} />
    </div>
  );
}
