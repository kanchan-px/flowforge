"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { deleteComment } from "../actions/delete-comment";
import { editComment } from "../actions/edit-comment";
import type { CommentData } from "../types";

function formatCommentTime(date: Date) {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

interface CommentItemProps {
  comment: CommentData;
  canEdit: boolean;
  canDelete: boolean;
  onChanged: () => Promise<void>;
}

export function CommentItem({
  comment,
  canEdit,
  canDelete,
  onChanged,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [isPending, startTransition] = useTransition();

  const authorName = comment.author?.name ?? "Deleted user";

  function handleSave() {
    startTransition(async () => {
      const result = await editComment(comment.id, draft);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setIsEditing(false);
      await onChanged();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteComment(comment.id);

      if (result.error) {
        toast.error(result.error);
        setConfirmingDelete(false);
        return;
      }

      await onChanged();
    });
  }

  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
        {authorName.charAt(0).toUpperCase()}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-sm font-semibold text-slate-900">
            {authorName}
          </span>
          <span className="text-xs text-slate-400">
            {formatCommentTime(comment.createdAt)}
            {comment.editedAt && " (edited)"}
          </span>
        </div>

        {isEditing ? (
          <div className="mt-2 space-y-2">
            <Textarea
              rows={3}
              value={draft}
              maxLength={2000}
              onChange={(event) => setDraft(event.target.value)}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                disabled={isPending || draft.trim() === ""}
                onClick={handleSave}
              >
                {isPending ? "Saving..." : "Save"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => {
                  setDraft(comment.content);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-700">
            {comment.content}
          </p>
        )}

        {!isEditing && (canEdit || canDelete) && (
          <div className="mt-1 flex items-center gap-3 text-xs">
            {canEdit && (
              <button
                type="button"
                className="text-slate-500 hover:text-slate-800"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            )}

            {canDelete &&
              (confirmingDelete ? (
                <span className="flex items-center gap-2 text-slate-500">
                  Delete this comment?
                  <button
                    type="button"
                    disabled={isPending}
                    className="font-medium text-red-600 hover:underline disabled:opacity-50"
                    onClick={handleDelete}
                  >
                    {isPending ? "Deleting..." : "Yes, delete"}
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    className="hover:underline"
                    onClick={() => setConfirmingDelete(false)}
                  >
                    Cancel
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  className="text-slate-500 hover:text-red-600"
                  onClick={() => setConfirmingDelete(true)}
                >
                  Delete
                </button>
              ))}
          </div>
        )}
      </div>
    </li>
  );
}