import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { AdminSubmissionsList } from "@/components/admin-submissions-list";

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") redirect("/dashboard");

  const { status } = await searchParams;

  const adminClient = createAdminClient();
  let query = adminClient
    .from("tool_submissions")
    .select("id, url, status, submitted_at, updated_at, name, slug, category_id, subcategory_id, category_snapshot, subcategory_snapshot, pricing, overview, short_description, detail_description, logo_url, hero_image_url, platform, pricing_info, key_features, use_cases, pros, cons, user_id")
    .order("submitted_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data: submissions, error } = await query;

  console.log("Query error:", error);
  console.log("Submissions data:", submissions);

  return (
    <div className="space-y-4 max-w-6xl">
      <h2 className="text-xl font-semibold">Tool Submissions</h2>
      <AdminSubmissionsList submissions={submissions ?? []} activeFilter={status ?? "all"} />
    </div>
  );
}
