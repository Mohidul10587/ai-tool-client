import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AvatarUpload } from "@/components/avatar-upload";
import { SettingsForm } from "@/components/settings-form";
import type { User } from "@supabase/supabase-js";

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

// Shared profile view (read + avatar upload)
export function ProfileView({ user, updateAction }: { user: User; updateAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }> }) {
  const name: string = user.user_metadata?.name ?? "User";
  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-xl font-semibold">Profile</h2>

      <Card>
        <CardContent className="pt-6 flex flex-col sm:flex-row items-center gap-6">
          <AvatarUpload userId={user.id} currentUrl={user.user_metadata?.avatar_url} initials={getInitials(name)} />
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-semibold text-base">{name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Badge variant="secondary" className="capitalize">{user.user_metadata?.role ?? "user"}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Edit Profile</CardTitle></CardHeader>
        <CardContent>
          <SettingsForm
            action={updateAction}
            fields={[{ name: "name", label: "Full Name", defaultValue: name }]}
            submitLabel="Save Changes"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Account Info</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-2">
          {[
            { label: "Email", value: user.email },
            { label: "User ID", value: user.id },
            { label: "Joined", value: new Date(user.created_at).toLocaleDateString() },
            { label: "Last Sign In", value: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "—" },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-2">
              <span className="text-muted-foreground w-24 shrink-0">{label}</span>
              <span className="font-medium break-all">{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Shared profile settings view (name + password)
export function ProfileSettingsView({ user, updateAction, updatePasswordAction }: {
  user: User;
  updateAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  updatePasswordAction: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
}) {
  const name: string = user.user_metadata?.name ?? "User";
  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-xl font-semibold">Profile Settings</h2>

      <Card>
        <CardHeader><CardTitle>Display Name</CardTitle></CardHeader>
        <CardContent>
          <SettingsForm
            action={updateAction}
            fields={[{ name: "name", label: "Full Name", defaultValue: name }]}
            submitLabel="Update Name"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
        <CardContent>
          <SettingsForm
            action={updatePasswordAction}
            fields={[
              { name: "password", label: "New Password", type: "password", minLength: 6 },
              { name: "confirm", label: "Confirm Password", type: "password", minLength: 6 },
            ]}
            submitLabel="Update Password"
          />
        </CardContent>
      </Card>
    </div>
  );
}
