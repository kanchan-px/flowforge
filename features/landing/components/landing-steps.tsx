import { BarChart3, CheckSquare, FolderKanban, UserPlus } from "lucide-react";

import { SectionHeading } from "./section-heading";

const steps = [
  {
    number: "01",
    icon: FolderKanban,
    title: "Create a project",
    description: "Name it, describe it and you are the owner.",
  },
  {
    number: "02",
    icon: UserPlus,
    title: "Invite your team",
    description: "Send email invitations and choose a role for each person.",
  },
  {
    number: "03",
    icon: CheckSquare,
    title: "Track the work",
    description:
      "Move tasks across the board, comment on them and watch progress on your dashboard.",
  },
];

export function LandingSteps() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-y border-slate-200 bg-slate-50 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="How it works"
          title="From idea to done in three steps"
          description="No setup to wade through. Start a project and invite people when you are ready."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="ff-reveal relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6"
            >
              <span className="absolute right-5 top-3 text-6xl font-bold text-blue-50">
                {step.number}
              </span>

              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                <step.icon className="h-5 w-5" />
              </div>

              <h3 className="relative mt-5 text-lg font-semibold text-slate-900">
                {step.title}
              </h3>

              <p className="relative mt-2 text-sm leading-6 text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-slate-500">
          <BarChart3 className="h-4 w-4" />
          Analytics update as your team completes tasks
        </div>
      </div>
    </section>
  );
}