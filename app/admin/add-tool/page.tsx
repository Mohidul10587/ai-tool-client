import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminAddToolForm } from "@/components/admin-add-tool-form";

export default async function AdminAddToolPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") redirect("/dashboard");

  return (
    <div className="space-y-4 max-w-4xl">
      <h2 className="text-xl font-semibold">Add New Tool</h2>
      <p className="text-sm text-muted-foreground">
        Directly add a tool to the directory without going through the submission process.
      </p>
      <AdminAddToolForm />
    </div>
  );
}
