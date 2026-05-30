import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/site-settings";
import { SiteSettingsForm } from "@/components/site-settings-form";

export default async function SiteSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") redirect("/dashboard");

  const settings = await getSiteSettings();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Site Settings</h2>
      <SiteSettingsForm settings={settings} />
    </div>
  );
}
