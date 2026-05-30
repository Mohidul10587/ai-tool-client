import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/panel-layout";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== "admin") redirect("/dashboard");

  const name: string = user.user_metadata?.name ?? user.email ?? "Admin";
  const avatarUrl: string | undefined = user.user_metadata?.avatar_url;

  return (
    <PanelLayout role="admin" userName={name} avatarUrl={avatarUrl}>
      {children}
    </PanelLayout>
  );
}
