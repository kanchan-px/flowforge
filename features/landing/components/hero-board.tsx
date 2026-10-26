import { MessageSquare, UserPlus } from "lucide-react";

interface MiniCardProps {
  title: string;
  tag: string;
  tagClass: string;
}

function MiniCard({ title, tag, tagClass }: MiniCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm">
      <p className="truncate text-[11px] font-medium text-slate-800 sm:text-xs">
        {title}
      </p>
      <span
        className={`mt-1.5 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium ${tagClass}`}
      >
        {tag}
      </span>
    </div>
  );
}

const columns = [
  {
    label: "To Do",
    dot: "bg-slate-400",
    cards: [
      { title: "Write API documentation", tag: "Low", tagClass: "bg-emerald-100 text-emerald-700" },
      { title: "Set up CI checks", tag: "High", tagClass: "bg-red-100 text-red-700" },
    ],
  },
  {
    label: "In Progress",
    dot: "bg-amber-500",
    cards: [
      { title: "Build invite flow", tag: "High", tagClass: "bg-red-100 text-red-700" },
      { title: "Review pull request", tag: "Medium", tagClass: "bg-amber-100 text-amber-700" },
    ],
  },
  {
    label: "Done",
    dot: "bg-emerald-500",
    cards: [
      { title: "Design database schema", tag: "Medium", tagClass: "bg-amber-100 text-amber-700" },
      { title: "Login and sign up", tag: "Low", tagClass: "bg-emerald-100 text-emerald-700" },
    ],
  },
];

const chipBase =
  "col-start-1 row-start-1 ff-chip justify-self-start rounded-full px-1.5 py-0.5 text-[10px] font-medium";

export function HeroBoard() {
  return (
    // Purely decorative, so screen readers skip it
    <div aria-hidden="true" className="relative mx-auto w-full max-w-3xl">
      {/* Soft glow behind the window */}
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-linear-to-r from-blue-400/20 to-violet-400/20 blur-2xl" />

      {/* Floating badges (hidden on small screens so nothing overflows) */}
      <div className="ff-float absolute -left-3 top-24 z-10 hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-lg md:flex lg:-left-12">
        <MessageSquare className="h-4 w-4 text-blue-600" />
        New comment
      </div>

      <div
        className="ff-float absolute -right-3 bottom-16 z-10 hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-lg md:flex lg:-right-12"
        style={{ animationDelay: "-3s" }}
      >
        <UserPlus className="h-4 w-4 text-emerald-600" />
        Aman joined
      </div>

      {/* The window */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-blue-900/10">
        <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          <span className="ml-3 truncate text-xs text-slate-400">
            flowforge / Website redesign
          </span>
        </div>

        <div className="p-3 sm:p-4">
          <div className="relative">
            <div className="grid grid-cols-3 gap-3">
              {columns.map((column) => (
                <div
                  key={column.label}
                  className="space-y-2 rounded-xl bg-slate-50 p-2.5"
                >
                  <div className="flex h-6 items-center gap-1.5 text-[11px] font-semibold text-slate-700 sm:text-xs">
                    <span className={`h-2 w-2 rounded-full ${column.dot}`} />
                    {column.label}
                  </div>

                  {/* Empty slot the moving card sits over */}
                  <div className="h-17 rounded-lg border border-dashed border-slate-300" />

                  {column.cards.map((card) => (
                    <MiniCard key={card.title} {...card} />
                  ))}
                </div>
              ))}
            </div>

            {/* The card that moves between columns */}
            <div className="ff-hop-card absolute rounded-lg border border-blue-300 bg-white p-2.5 shadow-lg ring-2 ring-blue-500/20">
              <p className="truncate text-[11px] font-semibold text-slate-900 sm:text-xs">
                Add task comments
              </p>

              <div className="mt-1.5 grid">
                <span className={`${chipBase} ff-chip-a bg-slate-100 text-slate-600`}>
                  To Do
                </span>
                <span className={`${chipBase} ff-chip-b bg-amber-100 text-amber-700`}>
                  In Progress
                </span>
                <span className={`${chipBase} ff-chip-c bg-emerald-100 text-emerald-700`}>
                  Done
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}