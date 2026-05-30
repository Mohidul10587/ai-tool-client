import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name: string = user.user_metadata?.name ?? "User";
  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Avatar><AvatarFallback>{initials}</AvatarFallback></Avatar>
            My Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {[
            { label: "Name", value: name },
            { label: "Email", value: user.email },
            { label: "Role", value: user.user_metadata?.role ?? "user" },
            { label: "Joined", value: new Date(user.created_at).toLocaleDateString() },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-2">
              <span className="text-muted-foreground w-20">{label}</span>
              <span className="font-medium capitalize">{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Saved Tools", value: "0" },
          { label: "Reviews", value: "0" },
          { label: "Bookmarks", value: "0" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
