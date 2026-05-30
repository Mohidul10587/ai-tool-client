import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminFeaturedAdPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") redirect("/dashboard");

  const { data: ads } = await supabase
    .from("featured_ads")
    .select("id, url, description, price_paid, status, rejection_message, submitted_at")
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Featured Ad Requests</h1>
        <Link href="/pricing" className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600">
          + New Request
        </Link>
      </div>

      {!ads?.length && (
        <p className="text-gray-500">
          No requests yet.{" "}
          <Link href="/pricing" className="text-emerald-600 underline">Submit one</Link>.
        </p>
      )}

      <div className="space-y-3">
        {ads?.map((ad) => (
          <div key={ad.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <a href={ad.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline">
              {ad.url}
            </a>
            <p className="mt-1 text-sm text-gray-700">{ad.description}</p>
            <p className="mt-1 text-xs text-gray-400">
              {new Date(ad.submitted_at).toLocaleDateString()} ·{" "}
              <span className={
                ad.status === "approved" ? "font-medium text-emerald-600" :
                ad.status === "rejected" ? "font-medium text-red-500" :
                "font-medium text-amber-500"
              }>
                {ad.status}
              </span>
              {ad.price_paid && <span className="ml-2 font-semibold text-gray-900">${ad.price_paid}</span>}
            </p>
            {ad.status === "rejected" && ad.rejection_message && (
              <div className="mt-2 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
                <span className="font-semibold">Reason: </span>{ad.rejection_message}
              </div>
            )}
            {ad.status === "approved" && (
              <div className="mt-2 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                Your ad is live and showing on the site.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
