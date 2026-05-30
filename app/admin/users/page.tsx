import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RoleToggleButton, DeleteUserButton, ChangePasswordButton } from "@/components/admin-buttons";
import { Input } from "@/components/ui/input";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") redirect("/dashboard");

  const { q } = await searchParams;
  const adminClient = createAdminClient();
  const { data: { users } } = await adminClient.auth.admin.listUsers();

  const filtered = q
    ? users.filter(
        (u) =>
          u.email?.toLowerCase().includes(q.toLowerCase()) ||
          u.user_metadata?.name?.toLowerCase().includes(q.toLowerCase())
      )
    : users;

  return (
    <div className="space-y-6 max-w-6xl">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle>Users ({filtered.length})</CardTitle>
          <form>
            <Input name="q" defaultValue={q ?? ""} placeholder="Search by name or email…" className="w-full sm:w-64" />
          </form>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Confirmed</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => {
                const role = u.user_metadata?.role ?? "user";
                const isSelf = u.id === user.id;
                return (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.user_metadata?.name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={role === "admin" ? "default" : "secondary"}>{role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.email_confirmed_at ? "default" : "destructive"}>
                        {u.email_confirmed_at ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {isSelf ? (
                        <span className="text-xs text-muted-foreground">You</span>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <RoleToggleButton userId={u.id} currentRole={role} />
                          <ChangePasswordButton userId={u.id} />
                          <DeleteUserButton userId={u.id} />
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
