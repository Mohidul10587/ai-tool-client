import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { unstable_noStore as noStore } from "next/cache";

export default async function DashboardPage() {
  noStore();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  console.log(user.user_metadata);
  const name: string = user.user_metadata?.name ?? "User";
  const avatarUrl: string | undefined = user.user_metadata?.avatar_url;
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="relative flex size-8 shrink-0 overflow-hidden rounded-full bg-muted">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={name} className="aspect-square size-full object-cover" />
              ) : (
                <span className="flex size-full items-center justify-center text-xs font-medium">{initials}</span>
              )}
            </div>
            My Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {[
            { label: "Name", value: name },
            {
              label: "Joined",
              value: new Date(user.created_at).toLocaleDateString(),
            },
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
