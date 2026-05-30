import { getAllPublicReviewRequests } from "@/lib/public-review-actions";
import AdminPublicReviewClient from "./client";

export default async function AdminPublicReviewPage() {
  const result = await getAllPublicReviewRequests();
  return <AdminPublicReviewClient requests={result.data ?? []} />;
}
