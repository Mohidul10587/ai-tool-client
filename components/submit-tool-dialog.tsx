"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { submitTool } from "@/lib/submission-actions";
import { LoginDialog } from "@/components/login-dialog";

interface Props {
  isLoggedIn: boolean;
  /** Trigger element — caller renders the button */
  children: React.ReactNode;
}

export function SubmitToolDialog({ isLoggedIn, children }: Props) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function handleTrigger() {
    if (!isLoggedIn) {
      setShowLogin(true);
    } else {
      setShowSubmit(true);
    }
  }

  function handleLoginSuccess() {
    setShowSubmit(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await submitTool(url);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setDone(true);
      setUrl("");
    }
  }

  return (
    <>
      <span onClick={handleTrigger} className="cursor-pointer">
        {children}
      </span>

      {/* Login gate */}
      <LoginDialog
        open={showLogin}
        onOpenChange={setShowLogin}
        onSuccess={handleLoginSuccess}
      />

      {/* Submit dialog */}
      <Dialog open={showSubmit} onOpenChange={(v) => { setShowSubmit(v); if (!v) { setDone(false); setError(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit an AI Tool</DialogTitle>
            <DialogDescription>
              Paste the official website URL of the tool. Our team will review and publish it.
            </DialogDescription>
          </DialogHeader>

          {done ? (
            <div className="py-6 text-center space-y-2">
              <p className="text-lg font-semibold">Submitted! 🎉</p>
              <p className="text-sm text-muted-foreground">
                We&apos;ll review your submission and publish it shortly.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => { setDone(false); setShowSubmit(false); }}>
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              {error && (
                <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>
              )}
              <div className="space-y-1">
                <Label htmlFor="tool-url">Official Tool URL</Label>
                <Input
                  id="tool-url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Payment options will be available soon. Free submissions are reviewed within 48 hours.
              </p>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting…" : "Submit Tool"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
