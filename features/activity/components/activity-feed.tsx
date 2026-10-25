"use client";

import { useState, useTransition, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { getMoreActivity } from "../actions/get-more-activity";
import type { ActivityItemData } from "../types";

const STATUS_LABELS: Record<string, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
};

function labelFor(map: Record<string, string>, value: string | null) {
  return value ? (map[value] ?? value) : "";
}

function Bold({ children }: { children: ReactNode }) {
  return <span className="font-medium text-slate-900">{children}</span>;
}

/** The sentence after the person's name, e.g. "moved Fix bug from To Do to Done". */
function describe(item: ActivityItemData): ReactNode {
  const task = <Bold>{item.taskName ?? "a task"}</Bold>;
  const target = <Bold>{item.targetName ?? "someone"}</Bold>;

  switch (item.type) {
    case "PROJECT_CREATED":
      return "created the project";
    case "PROJECT_UPDATED":
      return "edited the project details";
    case "TASK_CREATED":
      return <>created {task}</>;
    case "TASK_UPDATED":
      return <>edited {task}</>;
    case "TASK_DELETED":
      return <>deleted {task}</>;
    case "TASK_STATUS_CHANGED":
      return (
        <>
          moved {task} from {labelFor(STATUS_LABELS, item.fromValue)} to{" "}
          {labelFor(STATUS_LABELS, item.toValue)}
        </>
      );
    case "TASK_ASSIGNED":
      return (
        <>
          assigned {task} to {target}
        </>
      );
    case "TASK_UNASSIGNED":
      return <>unassigned {task}</>;
    case "TASK_COMMENTED":
      return <>commented on {task}</>;
    case "MEMBER_INVITED":
      return (
        <>
          invited {target} as {labelFor(ROLE_LABELS, item.toValue)}
        </>
      );
    case "MEMBER_JOINED":
      return <>joined the project as {labelFor(ROLE_LABELS, item.toValue)}</>;
    case "MEMBER_REMOVED":
      return <>removed {target} from the project</>;
    case "MEMBER_LEFT":
      return "left the project";
    case "MEMBER_ROLE_CHANGED":
      return (
        <>
          changed {target}&apos;s role from{" "}
          {labelFor(ROLE_LABELS, item.fromValue)} to{" "}
          {labelFor(ROLE_LABELS, item.toValue)}
        </>
      );
    default:
      return "did something";
  }
}

function formatTime(date: Date) {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

interface ActivityFeedProps {
  projectId: string;
  initialItems: ActivityItemData[];
  initialCursor: string | null;
}

export function ActivityFeed({
  projectId,
  initialItems,
  initialCursor,
}: ActivityFeedProps) {
  // The newest entries always come straight from the server (props).
  // Only the extra pages from "Load more" are kept here.
  const [olderItems, setOlderItems] = useState<ActivityItemData[]>([]);
  // undefined = "Load more" hasn't been used yet
  const [loadedCursor, setLoadedCursor] = useState<string | null | undefined>(
    undefined,
  );
  const [isPending, startTransition] = useTransition();

  const nextCursor = loadedCursor === undefined ? initialCursor : loadedCursor;
  const items = [...initialItems, ...olderItems];

  function handleLoadMore() {
    if (!nextCursor) {
      return;
    }

    startTransition(async () => {
      const result = await getMoreActivity(projectId, nextCursor);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      setOlderItems((current) => [...current, ...result.items]);
      setLoadedCursor(result.nextCursor);
    });
  }

  if (items.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-slate-500">
        No activity yet. Creating tasks, moving them, commenting and inviting
        people will show up here.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-4">
        {items.map((item) => {
          const actorName = item.actor?.name ?? "Deleted user";

          return (
            <li key={item.id} className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                {actorName.charAt(0).toUpperCase()}
              </span>

              <div className="min-w-0 flex-1">
                <p className="break-words text-sm text-slate-600">
                  <Bold>{actorName}</Bold> {describe(item)}
                </p>

                <time
                  dateTime={new Date(item.createdAt).toISOString()}
                  suppressHydrationWarning
                  className="text-xs text-slate-400"
                >
                  {formatTime(item.createdAt)}
                </time>
              </div>
            </li>
          );
        })}
      </ul>

      {nextCursor && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={handleLoadMore}
          >
            {isPending ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}