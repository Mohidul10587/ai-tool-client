"use client";

import { useState } from "react";
import { changeUserRole, deleteUser, updateUserPassword } from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";

export function RoleToggleButton({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    const newRole = currentRole === "admin" ? "user" : "admin";
    await changeUserRole(userId, newRole);
    setLoading(false);
  }

  return (
    <Button size="sm" variant="outline" onClick={handleToggle} disabled={loading}>
      {loading ? "…" : currentRole === "admin" ? "Make User" : "Make Admin"}
    </Button>
  );
}

export function DeleteUserButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this user permanently?")) return;
    setLoading(true);
    await deleteUser(userId);
    setLoading(false);
  }

  return (
    <Button size="sm" variant="destructive" onClick={handleDelete} disabled={loading}>
      {loading ? "…" : "Delete"}
    </Button>
  );
}

export function ChangePasswordButton({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await updateUserPassword(userId, password);
    setLoading(false);
    if (result?.error) { setError(result.error); return; }
    setOpen(false);
    setPassword("");
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>Password</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Change Password</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New password (min. 6 chars)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={6}
                required
                className="pr-10"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? "Saving…" : "Save"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
