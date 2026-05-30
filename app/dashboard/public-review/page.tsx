import { getUserPublicReviewRequests } from "@/lib/public-review-actions";
import Link from "next/link";
import { DashboardPublicReviewClient } from "./client";

export default async function DashboardPublicReviewPage() {
  const result = await getUserPublicReviewRequests();
  const requests = result.data ?? [];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Public Review Requests</h1>
        <Link href="/pricing" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">+ New Request</Link>
      </div>
      {!requests.length ? (
        <p className="text-gray-500">No requests yet. <Link href="/pricing" className="text-gray-900 underline">Submit one</Link>.</p>
      ) : (
        <DashboardPublicReviewClient requests={requests} />
      )}
    </div>
  );
}
