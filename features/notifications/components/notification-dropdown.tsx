"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  Clock,
  FolderKanban,
} from "lucide-react";

import { markNotificationAsRead } from "../actions/mark-notification-read";
import { markAllNotificationsAsRead } from "../actions/mark-all-as-read";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  taskId: string | null;
  projectId: string | null;
  createdAt: Date;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
}

function formatTime(date: Date) {
  const now = new Date();
  const notificationDate = new Date(date);

  const diff = now.getTime() - notificationDate.getTime();

  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return notificationDate.toLocaleDateString();
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "TASK_CREATED":
      return <Check className="h-4 w-4 text-blue-600" />;

    case "TASK_COMPLETED":
      return <Check className="h-4 w-4 text-green-600" />;

    case "TASK_OVERDUE":
      return <Clock className="h-4 w-4 text-red-600" />;

    case "TASK_UPDATED":
      return <Check className="h-4 w-4 text-blue-600" />;

    case "TASK_DELETED":
      return <Check className="h-4 w-4 text-slate-600" />;

    case "PROJECT_CREATED":
      return <FolderKanban className="h-4 w-4 text-blue-600" />;

    case "PROJECT_UPDATED":
      return <FolderKanban className="h-4 w-4 text-blue-600" />;

    case "PROJECT_DELETED":
      return <FolderKanban className="h-4 w-4 text-slate-600" />;

    default:
      return <Bell className="h-4 w-4 text-slate-600" />;
  }
}

export function NotificationDropdown({
  notifications: initialNotifications,
  unreadCount: initialUnreadCount,
}: NotificationDropdownProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);

  const [notifications, setNotifications] = useState(
    initialNotifications,
  );

  const [unreadCount, setUnreadCount] = useState(
    initialUnreadCount,
  );

  function handleNotificationClick(notification: Notification) {
    startTransition(async () => {
      try {
        if (!notification.read) {
          await markNotificationAsRead(notification.id);

          setNotifications((current) =>
            current.map((item) =>
              item.id === notification.id
                ? {
                    ...item,
                    read: true,
                  }
                : item,
            ),
          );

          setUnreadCount((current) => Math.max(0, current - 1));
        }

        setOpen(false);

        /*
         * Deleted tasks no longer exist.
         * In that case, take the user to the project.
         */
        if (
          notification.type === "TASK_DELETED" &&
          notification.projectId
        ) {
          router.push(
            `/projects/${notification.projectId}`,
          );
          return;
        }

        /*
         * For task-related notifications, take the user
         * to that task's project for now.
         */
        if (
          notification.type.startsWith("TASK") &&
          notification.projectId
        ) {
          router.push(
            `/tasks?project=${notification.projectId}`,
          );
          return;
        }

        /*
         * Project notifications go directly to the project.
         */
        if (
          notification.type.startsWith("PROJECT") &&
          notification.projectId
        ) {
          router.push(
            `/projects/${notification.projectId}`,
          );
          return;
        }
      } catch (error) {
        console.error(
          "Failed to handle notification:",
          error,
        );
      }
    });
  }

  function handleMarkAllAsRead() {
    startTransition(async () => {
      try {
        await markAllNotificationsAsRead();

        setNotifications((current) =>
          current.map((notification) => ({
            ...notification,
            read: true,
          })),
        );

        setUnreadCount(0);
      } catch (error) {
        console.error(
          "Failed to mark all notifications as read:",
          error,
        );
      }
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-xl p-2 transition hover:bg-slate-100"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-slate-600" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
            <div>
              <h3 className="font-semibold text-slate-900">
                Notifications
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount === 1 ? "" : "s"
                    }`
                  : "You&apos;re all caught up"}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                disabled={isPending}
                onClick={handleMarkAllAsRead}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Marking..." : "Mark all read"}
              </button>
            )}
          </div>

          {/* Empty state */}
          {notifications.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Bell className="h-5 w-5 text-slate-400" />
              </div>

              <p className="mt-3 text-sm font-medium text-slate-700">
                No notifications
              </p>

              <p className="mt-1 text-xs text-slate-500">
                You&apos;re all caught up.
              </p>
            </div>
          ) : (
            <div className="max-h-[420px] overflow-y-auto">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    handleNotificationClick(notification)
                  }
                  className={`flex w-full gap-3 border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50 ${
                    !notification.read
                      ? "bg-blue-50/40"
                      : "bg-white"
                  }`}
                >
                  {/* Icon */}
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    {getNotificationIcon(
                      notification.type,
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {notification.title}
                      </p>

                      {!notification.read && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                      )}
                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-[11px] text-slate-400">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}