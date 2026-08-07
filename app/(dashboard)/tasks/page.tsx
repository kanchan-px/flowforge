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
    sort?: string;
    page?: string;
  }>;
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const filters = await searchParams;

  const status = filters.status;
  const priority = filters.priority;
  const project = filters.project;
  const search = filters.search;
  const sort = filters.sort;
  const page = Number(filters.page ?? "1");
  const PAGE_SIZE = 10;
  const skip = (page - 1) * PAGE_SIZE;
  const hasFilters = !!status || !!priority || !!project || !!search || !!sort;

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
  let orderBy: any = {
    createdAt: "desc",
  };

  switch (sort) {
    case "oldest":
      orderBy = {
        createdAt: "asc",
      };
      break;

    case "due":
      orderBy = {
        dueDate: "asc",
      };
      break;
  }
  const projects = await prisma.project.findMany({
    where: {
      ownerId: session.user.id,
    },
    orderBy: {
      name: "asc",
    },
  });

  const totalTasks = await prisma.task.count({
    where: {
      project: {
        ownerId: session.user.id,
      },
    },
  });

  const tasks = await prisma.task.findMany({
    where,
    skip,
    take: PAGE_SIZE,
    include: {
      project: true,
    },
    orderBy,
  });

  const filteredTasks = await prisma.task.count({
    where,
  });

  const totalPages = Math.ceil(filteredTasks / PAGE_SIZE);

  const priorityOrder = {
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };

  const statusOrder = {
    TODO: 1,
    IN_PROGRESS: 2,
    DONE: 3,
  };

  if (sort === "priority") {
    tasks.sort(
      (a, b) =>
        priorityOrder[b.priority as keyof typeof priorityOrder] -
        priorityOrder[a.priority as keyof typeof priorityOrder],
    );
  }

  if (sort === "status") {
    tasks.sort(
      (a, b) =>
        statusOrder[a.status as keyof typeof statusOrder] -
        statusOrder[b.status as keyof typeof statusOrder],
    );
  }

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

      <TaskList
        tasks={tasks}
        projects={projects}
        hasFilters={hasFilters}
        totalTasks={totalTasks}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
