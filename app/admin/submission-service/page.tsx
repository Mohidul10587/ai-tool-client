import { getAllSubmissionServiceRequests } from "@/lib/submission-service-actions";
import AdminSubmissionServiceClient from "./client";

export default async function AdminSubmissionServicePage() {
  const result = await getAllSubmissionServiceRequests();
  return <AdminSubmissionServiceClient requests={result.data ?? []} />;
}
