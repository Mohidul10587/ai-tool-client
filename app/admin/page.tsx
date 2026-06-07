import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RoleToggleButton, DeleteUserButton } from "@/components/admin-buttons";
import { Plus, FileText } from "lucide-react";
import Link from "next/link";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") redirect("/dashboard");

  const adminClient = createAdminClient();
  const { data: { users } } = await adminClient.auth.admin.listUsers();

  const totalAdmins = users.filter(u => u.user_metadata?.role === "admin").length;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/add-tool">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Tool
              </Button>
            </Link>
            <Link href="/admin/add-featured-ad">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Add Featured Ad
              </Button>
            </Link>
            <Link href="/admin/tool-submissions">
              <Button variant="outline">
                View Submissions
              </Button>
            </Link>
            <Link href="/admin/featured-ads">
              <Button variant="outline">
                Manage Featured Ads
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: users.length },
          { label: "Admins", value: totalAdmins },
          { label: "Regular Users", value: users.length - totalAdmins },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>All Users</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => {
                const role = u.user_metadata?.role ?? "user";
                const isSelf = u.id === user.id;
                return (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.user_metadata?.name ?? "—"}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={role === "admin" ? "default" : "secondary"}>{role}</Badge>
                    </TableCell>
                    <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {isSelf ? (
                        <span className="text-xs text-muted-foreground">You</span>
                      ) : (
                        <div className="flex gap-2">
                          <RoleToggleButton userId={u.id} currentRole={role} />
                          <DeleteUserButton userId={u.id} />
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
