import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getAnalytics(days: 7 | 30 = 7) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const userId = session.user.id;

  // --------------------------------
  // FILTERS
  // --------------------------------

  const projectWhere = {
    ownerId: userId,
  };

  const taskWhere = {
    project: {
      ownerId: userId,
    },
  };

  // --------------------------------
  // DATES
  // --------------------------------

  const now = new Date();

  // Today + previous 6 days = 7 days
  const trendStartDate = new Date();

  trendStartDate.setDate(trendStartDate.getDate() - (days - 1));

  trendStartDate.setHours(0, 0, 0, 0);
  // --------------------------------
  // ANALYTICS QUERIES
  // --------------------------------

  const [
    totalProjects,
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,
    overdueTasks,
    highPriorityTasks,
    mediumPriorityTasks,
    lowPriorityTasks,
    projects,
    statusHistory,
    completedTaskHistory,
  ] = await Promise.all([
    // --------------------------------
    // PROJECT COUNT
    // --------------------------------

    prisma.project.count({
      where: projectWhere,
    }),

    // --------------------------------
    // TASK COUNT
    // --------------------------------

    prisma.task.count({
      where: taskWhere,
    }),

    // --------------------------------
    // COMPLETED TASKS
    // --------------------------------

    prisma.task.count({
      where: {
        ...taskWhere,
        status: "DONE",
      },
    }),

    // --------------------------------
    // IN-PROGRESS TASKS
    // --------------------------------

    prisma.task.count({
      where: {
        ...taskWhere,
        status: "IN_PROGRESS",
      },
    }),

    // --------------------------------
    // TODO TASKS
    // --------------------------------

    prisma.task.count({
      where: {
        ...taskWhere,
        status: "TODO",
      },
    }),

    // --------------------------------
    // OVERDUE TASKS
    // --------------------------------

    prisma.task.count({
      where: {
        ...taskWhere,
        dueDate: {
          lt: now,
        },
        status: {
          not: "DONE",
        },
      },
    }),

    // --------------------------------
    // HIGH PRIORITY TASKS
    // --------------------------------

    prisma.task.count({
      where: {
        ...taskWhere,
        priority: "HIGH",
      },
    }),

    // --------------------------------
    // MEDIUM PRIORITY TASKS
    // --------------------------------

    prisma.task.count({
      where: {
        ...taskWhere,
        priority: "MEDIUM",
      },
    }),

    // --------------------------------
    // LOW PRIORITY TASKS
    // --------------------------------

    prisma.task.count({
      where: {
        ...taskWhere,
        priority: "LOW",
      },
    }),

    // --------------------------------
    // PROJECT ANALYTICS
    // --------------------------------

    prisma.project.findMany({
      where: projectWhere,

      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,

        _count: {
          select: {
            tasks: true,
          },
        },

        tasks: {
          select: {
            status: true,
          },
        },
      },
    }),

    // --------------------------------
    // RECENT STATUS ACTIVITY
    // --------------------------------

    prisma.taskStatusHistory.findMany({
      where: {
        task: {
          project: {
            ownerId: userId,
          },
        },
      },

      orderBy: {
        changedAt: "desc",
      },

      take: 20,

      select: {
        id: true,
        fromStatus: true,
        toStatus: true,
        changedAt: true,

        task: {
          select: {
            id: true,
            name: true,

            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),

    // --------------------------------
    // COMPLETED TASK HISTORY
    // Used for productivity trend
    // --------------------------------

    prisma.taskStatusHistory.findMany({
      where: {
        toStatus: "DONE",

        changedAt: {
          gte: trendStartDate,
        },

        task: {
          project: {
            ownerId: userId,
          },
        },
      },

      orderBy: {
        changedAt: "asc",
      },

      select: {
        changedAt: true,
      },
    }),
  ]);

  // --------------------------------
  // COMPLETION RATE
  // --------------------------------

  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // --------------------------------
  // PROJECT ANALYTICS
  // --------------------------------

  const projectAnalytics = projects.map((project) => {
    const completed = project.tasks.filter(
      (task) => task.status === "DONE",
    ).length;

    return {
      id: project.id,
      name: project.name,
      totalTasks: project._count.tasks,
      completedTasks: completed,
    };
  });

  // --------------------------------
  // RECENT ACTIVITY
  // --------------------------------

  const recentActivity = statusHistory.map((history) => ({
    id: history.id,

    taskId: history.task.id,
    taskName: history.task.name,

    projectId: history.task.project.id,
    projectName: history.task.project.name,

    fromStatus: history.fromStatus,
    toStatus: history.toStatus,

    changedAt: history.changedAt,
  }));

  // --------------------------------
  // PRODUCTIVITY TREND
  // --------------------------------

  const productivityTrend = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(trendStartDate);

    date.setDate(trendStartDate.getDate() + i);

    const nextDate = new Date(date);

    nextDate.setDate(date.getDate() + 1);

    const count = completedTaskHistory.filter((history) => {
      return history.changedAt >= date && history.changedAt < nextDate;
    }).length;

    productivityTrend.push({
      date: date.toISOString().split("T")[0],
      completedTasks: count,
    });
  }

  // --------------------------------
  // RETURN ANALYTICS DATA
  // --------------------------------

  return {
    overview: {
      totalProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      completionRate,
    },

    priority: {
      high: highPriorityTasks,
      medium: mediumPriorityTasks,
      low: lowPriorityTasks,
    },

    projects: projectAnalytics,

    recentActivity,

    trend: productivityTrend,
  };
}
