import { prisma } from "@/lib/prisma";

export async function getProjectDetails(
  projectId: string,
  userId: string,
) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [{ ownerId: userId }, { members: { some: { userId } } }],
    },
    include: {
      tasks: {
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          tasks: true,
        },
      },
    },
  });

  return project;
}