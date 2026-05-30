import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileSettingsView } from "@/components/profile-views";
import { updateProfile, updatePassword } from "@/lib/user-actions";

export default async function UserSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return <ProfileSettingsView user={user} updateAction={updateProfile} updatePasswordAction={updatePassword} />;
}
