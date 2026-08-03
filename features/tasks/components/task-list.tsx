import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { TaskCard } from "./task-card";

export async function TaskList() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const tasks = await prisma.task.findMany({
    where: {
      project: {
        ownerId: session.user.id,
      },
    },
    include: {
      project: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-20 text-center">
        <h3 className="text-xl font-bold">No tasks yet</h3>

        <p className="mt-2 text-slate-500">Create your first task.</p>
      </div>
    );
  }

  const projects = await prisma.project.findMany({
  where: {
    ownerId: session.user.id,
  },
  orderBy: {
    name: "asc",
  },
});

  return (
  <div className="space-y-4">
    {tasks.map((task) => (
      <TaskCard
  key={task.id}
  id={task.id}
  name={task.name}
  description={task.description}
  status={task.status as "TODO" | "IN_PROGRESS" | "DONE"}
  priority={task.priority as "LOW" | "MEDIUM" | "HIGH"}
  dueDate={task.dueDate}
  projectId={task.projectId}
  projects={projects}
/>
    ))}
  </div>
);
}
