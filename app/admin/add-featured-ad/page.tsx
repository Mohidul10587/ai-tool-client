import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminAddFeaturedAdForm } from "@/components/admin-add-featured-ad-form";

export default async function AdminAddFeaturedAdPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") redirect("/dashboard");

  return (
    <div className="space-y-4 max-w-4xl">
      <h2 className="text-xl font-semibold">Add Featured Ad</h2>
      <p className="text-sm text-muted-foreground">
        Directly add a featured advertisement without going through the submission process.
      </p>
      <AdminAddFeaturedAdForm />
    </div>
  );
}
