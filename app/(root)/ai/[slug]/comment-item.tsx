"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { deleteComment, type CommentRow } from "@/lib/comment-actions";

export function CommentItem({
  comment,
  currentUserId,
  toolSlug,
  onDelete,
}: {
  comment: CommentRow;
  currentUserId: string | null;
  toolSlug: string;
  onDelete: (id: string) => void;
}) {
  const [votes, setVotes] = useState({ up: comment.upvotes, down: comment.downvotes });
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [pending, startTransition] = useTransition();

  const handleVote = (type: "up" | "down") => {
    const newVotes = { ...votes };
    if (userVote === type) {
      newVotes[type]--;
      setUserVote(null);
    } else {
      if (userVote) newVotes[userVote]--;
      newVotes[type]++;
      setUserVote(type);
    }
    setVotes(newVotes);
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteComment(comment.id, toolSlug);
      onDelete(comment.id);
    });
  };

  const profileData = Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles;
  const name = profileData?.name ?? "User";
  const avatar = profileData?.avatar_url ?? "";
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const timeAgo = new Date(comment.created_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 last:border-0">
      <div className="flex flex-col items-center shrink-0 border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => handleVote("up")}
          className={`text-xs w-full px-2 py-1.5 flex items-center justify-center hover:bg-gray-50 ${userVote === "up" ? "text-black" : "text-gray-400"}`}
        >▲</button>
        <span className="text-xs font-medium text-black px-2">{votes.up - votes.down}</span>
        <button
          onClick={() => handleVote("down")}
          className={`text-xs w-full px-2 py-1.5 flex items-center justify-center hover:bg-gray-50 ${userVote === "down" ? "text-black" : "text-gray-400"}`}
        >▼</button>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <Avatar className="h-6 w-6">
            <AvatarImage src={avatar} />
            <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">{initials}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-black text-sm">{name}</span>
          <span className="text-gray-400 text-xs">·</span>
          <span className="text-gray-500 text-xs">{timeAgo}</span>
          {currentUserId === comment.user_id && (
            <button onClick={handleDelete} disabled={pending} className="ml-auto text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
      </div>
    </div>
  );
}
