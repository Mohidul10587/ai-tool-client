import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/panel-layout";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const name: string = user.user_metadata?.name ?? user.email ?? "User";
  const avatarUrl: string | undefined = user.user_metadata?.avatar_url;

  return (
    <PanelLayout role="user" userName={name} avatarUrl={avatarUrl}>
      {children}
    </PanelLayout>
  );
}
