import { Bell } from "lucide-react";

export function NotificationSettings() {
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
        />

        <NotificationOption
          title="Project activity notifications"
          description="Receive notifications about project activity."
        />

        <NotificationOption
          title="System notifications"
          description="Receive important FlowForge system notifications."
        />
      </div>
    </section>
  );
}

function NotificationOption({
  title,
  description,
}: {
  title: string;
  description: string;
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
        className="relative h-6 w-11 shrink-0 rounded-full bg-primary transition"
        aria-label={`Toggle ${title}`}
      >
        <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-primary-foreground" />
      </button>
    </div>
  );
}