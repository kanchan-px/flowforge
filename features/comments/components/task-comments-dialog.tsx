"use client";

import { MessageSquare } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CommentThread } from "./comment-thread";

interface TaskCommentsDialogProps {
  taskId: string;
  taskName: string;
  commentCount: number;
  compact?: boolean;
}

export function TaskCommentsDialog({
  taskId,
  taskName,
  commentCount,
  compact = false,
}: TaskCommentsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        aria-label={`Comments on ${taskName} (${commentCount})`}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-md border bg-white text-slate-600 transition hover:bg-slate-100",
          compact ? "h-8 px-2 text-xs" : "h-9 px-3 text-sm",
        )}
      >
        <MessageSquare className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
        {commentCount}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
          <DialogDescription className="truncate">{taskName}</DialogDescription>
        </DialogHeader>

        <CommentThread taskId={taskId} />
      </DialogContent>
    </Dialog>
  );
}