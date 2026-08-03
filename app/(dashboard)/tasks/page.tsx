import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { CreateTaskDialog } from "@/features/tasks/components/create-task-dialog";
import { TaskFilters } from "@/features/tasks/components/task-filters";
import { TaskList } from "@/features/tasks/components/task-list";

interface TasksPageProps {
  searchParams: Promise<{
    status?: string;
    priority?: string;
    project?: string;
    search?: string;
  }>;
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const filters = await searchParams;

  const status = filters.status;
  const priority = filters.priority;
  const project = filters.project;
  const search = filters.search;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }
  const where: any = {
    project: {
      ownerId: session.user.id,
    },
  };

  if (status) {
    where.status = status;
  }

  if (priority) {
    where.priority = priority;
  }

  if (project) {
    where.projectId = project;
  }

  if (search) {
  where.OR = [
    {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    {
      description: {
        contains: search,
        mode: "insensitive",
      },
    },
  ];
}

  const projects = await prisma.project.findMany({
    where: {
      ownerId: session.user.id,
    },
    orderBy: {
      name: "asc",
    },
  });

  const tasks = await prisma.task.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>

          <p className="text-slate-500">Manage all your project tasks</p>
        </div>

        <CreateTaskDialog />
      </div>

      <TaskFilters projects={projects} />

      <TaskList tasks={tasks} projects={projects} />
    </div>
  );
}
