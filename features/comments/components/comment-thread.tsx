"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { addComment } from "../actions/add-comment";
import { getTaskComments } from "../actions/get-task-comments";
import type { CommentData } from "../types";
import { CommentItem } from "./comment-item";

export function CommentThread({ taskId }: { taskId: string }) {
  // null means "still loading"
  const [comments, setComments] = useState<CommentData[] | null>(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const [canModerate, setCanModerate] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [isPosting, startPosting] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    const result = await getTaskComments(taskId);

    if ("error" in result) {
      setLoadError(result.error);
      return;
    }

    setLoadError(null);
    setComments(result.comments);
    setCurrentUserId(result.currentUserId);
    setCanModerate(result.canModerate);
  }, [taskId]);

  useEffect(() => {
    load();
  }, [load]);

  function handlePost() {
    if (draft.trim() === "") {
      return;
    }

    startPosting(async () => {
      const result = await addComment(taskId, draft);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setDraft("");
      await load();

      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      });
    });
  }

  return (
    <div className="space-y-4">
      <div className="max-h-72 overflow-y-auto pr-1">
        {loadError ? (
          <p className="py-6 text-center text-sm text-red-600">{loadError}</p>
        ) : comments === null ? (
          <p className="py-6 text-center text-sm text-slate-500">
            Loading comments...
          </p>
        ) : comments.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            No comments yet. Start the discussion.
          </p>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment) => {
              const isAuthor = comment.author?.id === currentUserId;

              return (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  canEdit={isAuthor}
                  canDelete={isAuthor || canModerate}
                  onChanged={load}
                />
              );
            })}
          </ul>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="space-y-2 border-t pt-4">
        <Textarea
          rows={3}
          value={draft}
          maxLength={2000}
          placeholder="Write a comment... (Ctrl+Enter to post)"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
              event.preventDefault();
              handlePost();
            }
          }}
        />

        <div className="flex justify-end">
          <Button
            disabled={isPosting || draft.trim() === ""}
            onClick={handlePost}
          >
            {isPosting ? "Posting..." : "Post comment"}
          </Button>
        </div>
      </div>
    </div>
  );
}