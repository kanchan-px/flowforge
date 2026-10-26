import {
  BarChart3,
  Clock,
  FolderKanban,
  Mail,
  MessageSquare,
  UserCheck,
} from "lucide-react";

import { SectionHeading } from "./section-heading";

const features = [
  {
    icon: FolderKanban,
    title: "Kanban boards",
    description:
      "Drag tasks between To Do, In Progress and Done. Moves save instantly, and two people moving the same task will not overwrite each other.",
  },
  {
    icon: UserCheck,
    title: "Roles and permissions",
    description:
      "Owner, Admin and Member roles. Every rule is enforced on the server, not just hidden in the interface.",
  },
  {
    icon: Mail,
    title: "Email invitations",
    description:
      "Invite teammates by email with secure links that expire after seven days. Accept or decline from your invitations page.",
  },
  {
    icon: MessageSquare,
    title: "Assign and discuss",
    description:
      "Assign tasks to project members and talk about them in comment threads. The people involved get notified.",
  },
  {
    icon: Clock,
    title: "Activity history",
    description:
      "A feed for every project that shows who changed what, and when.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Completion rate, priority breakdown, project progress and a 7 or 30 day productivity trend.",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="scroll-mt-20 bg-white px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Features"
          title="Everything a small team needs"
          description="From the first task to the last comment, FlowForge keeps the work and the people in one place."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="ff-reveal rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <feature.icon className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}