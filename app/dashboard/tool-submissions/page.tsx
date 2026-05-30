import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserSubmissions } from "@/lib/submission-actions";
import { UserSubmissionsList } from "@/components/user-submissions-list";
import Link from "next/link";

export default async function DashboardSubmissionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const result = await getUserSubmissions();
  const submissions = result.data ?? [];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Submitted Tools</h1>
        <Link href="/pricing" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">+ New Submission</Link>
      </div>
      {!submissions.length ? (
        <p className="text-gray-500">No submissions yet. <Link href="/pricing" className="text-gray-900 underline">Submit one</Link>.</p>
      ) : (
        <UserSubmissionsList submissions={submissions} />
      )}
    </div>
  );
}
