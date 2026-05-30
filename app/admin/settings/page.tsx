import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileSettingsView } from "@/components/profile-views";
import { updateAdminProfile, updateAdminPassword } from "@/lib/admin-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") redirect("/dashboard");

  return (
    <div className="space-y-6 max-w-lg">
      <ProfileSettingsView user={user} updateAction={updateAdminProfile} updatePasswordAction={updateAdminPassword} />

      {/* Account Info */}
      <Card>
        <CardHeader><CardTitle>Account Info</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-2">
          {[
            { label: "Email", value: user.email },
            { label: "Role", value: user.user_metadata?.role ?? "admin" },
            { label: "User ID", value: user.id },
            { label: "Joined", value: new Date(user.created_at).toLocaleDateString() },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-2">
              <span className="text-muted-foreground w-20">{label}</span>
              <span className="font-medium break-all">{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
