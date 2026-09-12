"use client";

import { useState, useTransition } from "react";
import { Bell } from "lucide-react";
import { toast } from "sonner";

import { updateNotificationPreference } from "../actions/update-notification-preferences";

interface NotificationPreferences {
  taskCompletedNotifications: boolean;
  projectActivityNotifications: boolean;
  systemNotifications: boolean;
}

interface NotificationSettingsProps {
  preferences: NotificationPreferences;
}

export function NotificationSettings({
  preferences,
}: NotificationSettingsProps) {
  const [taskCompleted, setTaskCompleted] = useState(
    preferences.taskCompletedNotifications,
  );

  const [projectActivity, setProjectActivity] = useState(
    preferences.projectActivityNotifications,
  );

  const [systemNotifications, setSystemNotifications] =
    useState(preferences.systemNotifications);

  const [isPending, startTransition] = useTransition();

  function handleToggle(
    preference:
      | "taskCompletedNotifications"
      | "projectActivityNotifications"
      | "systemNotifications",
    currentValue: boolean,
    setValue: (value: boolean) => void,
  ) {
    const newValue = !currentValue;

    setValue(newValue);

    startTransition(async () => {
      const result = await updateNotificationPreference(
        preference,
        newValue,
      );

      if (!result.success) {
        setValue(currentValue);
        toast.error(
          result.error ?? "Failed to update notification preference.",
        );
        return;
      }

      toast.success(
        newValue
          ? "Notification preference enabled."
          : "Notification preference disabled.",
      );
    });
  }

  return (
    <section className="rounded-xl border bg-card">
      <div className="border-b p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Bell className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Notifications
            </h2>

            <p className="text-sm text-muted-foreground">
              Manage your notification preferences.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y">
        <NotificationOption
          title="Task completed notifications"
          description="Receive notifications when tasks are completed."
          enabled={taskCompleted}
          disabled={isPending}
          onToggle={() =>
            handleToggle(
              "taskCompletedNotifications",
              taskCompleted,
              setTaskCompleted,
            )
          }
        />

        <NotificationOption
          title="Project activity notifications"
          description="Receive notifications about project activity."
          enabled={projectActivity}
          disabled={isPending}
          onToggle={() =>
            handleToggle(
              "projectActivityNotifications",
              projectActivity,
              setProjectActivity,
            )
          }
        />

        <NotificationOption
          title="System notifications"
          description="Receive important FlowForge system notifications."
          enabled={systemNotifications}
          disabled={isPending}
          onToggle={() =>
            handleToggle(
              "systemNotifications",
              systemNotifications,
              setSystemNotifications,
            )
          }
        />
      </div>
    </section>
  );
}

function NotificationOption({
  title,
  description,
  enabled,
  disabled,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 p-6">
      <div>
        <p className="text-sm font-medium">{title}</p>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-label={`Toggle ${title}`}
        aria-pressed={enabled}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-primary"
            : "bg-muted-foreground/30"
        } ${
          disabled
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-primary-foreground transition-all ${
            enabled ? "right-1" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}