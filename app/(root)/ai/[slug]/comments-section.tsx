"use client";

import { useState, useTransition, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addComment, type CommentRow } from "@/lib/comment-actions";
import { CommentItem } from "./comment-item";

async function fetchComments(toolId: string): Promise<CommentRow[]> {
  const res = await fetch(`/api/comments?toolId=${toolId}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export function CommentsSection({
  toolId,
  toolSlug,
  currentUser,
}: {
  toolId: string;
  toolSlug: string;
  currentUser: { id: string; name: string; avatar_url: string | null } | null;
}) {
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    fetchComments(toolId).then(setComments);
  }, [toolId]);

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    setError("");
    const content = newComment.trim();
    startTransition(async () => {
      const result = await addComment(toolId, toolSlug, content);
      if (result.error) { setError(result.error); return; }
      const fresh = await fetchComments(toolId);
      setComments(fresh);
      setNewComment("");
    });
  };

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-black mb-4">Community Discussion</h2>

      {currentUser ? (
        <div className="mb-4 relative">
          <Textarea
            placeholder="Leave a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
            className="min-h-[80px] resize-none pr-12 text-sm"
          />
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={pending || !newComment.trim()}
            className="absolute bottom-2 right-2 bg-black hover:bg-gray-800 text-white h-8 w-8 p-0"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-4">
          <a href="/login" className="text-black font-medium underline">Log in</a>{" "}
          to leave a comment.
        </p>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No comments yet. Be the first!</p>
        ) : (
          comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              currentUserId={currentUser?.id ?? null}
              toolSlug={toolSlug}
              onDelete={(id) => setComments((prev) => prev.filter((x) => x.id !== id))}
            />
          ))
        )}
      </div>
    </section>
  );
}
