import {
  CheckCircle2,
  FolderKanban,
  UserPlus,
  ClipboardList,
} from "lucide-react";

const activities = [
  {
    id: 1,
    title: "Landing Page completed",
    description: "UI team marked the task as completed.",
    icon: CheckCircle2,
  },
  {
    id: 2,
    title: "New Project created",
    description: "Website Redesign project was added.",
    icon: FolderKanban,
  },
  {
    id: 3,
    title: "New member joined",
    description: "Rahul joined your workspace.",
    icon: UserPlus,
  },
  {
    id: 4,
    title: "Task assigned",
    description: "API Integration assigned to you.",
    icon: ClipboardList,
  },
];

export function RecentActivity() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">
        Recent Activity
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Latest updates from your workspace.
      </p>

      <div className="mt-6 space-y-5">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-4"
            >
              <div className="rounded-xl bg-blue-100 p-3">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  {activity.title}
                </p>

                <p className="text-sm text-slate-500">
                  {activity.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}