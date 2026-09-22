const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.project.findMany({
    select: { id: true, ownerId: true },
  });

  if (projects.length === 0) {
    console.log("No projects found. Nothing to backfill.");
    return;
  }

  const result = await prisma.projectMember.createMany({
    data: projects.map((project) => ({
      projectId: project.id,
      userId: project.ownerId,
      role: "OWNER",
    })),
    skipDuplicates: true,
  });

  console.log(`Projects checked: ${projects.length}`);
  console.log(`OWNER memberships created: ${result.count}`);
  console.log(`Already had a membership (skipped): ${projects.length - result.count}`);
}

main()
  .catch((error) => {
    console.error("Backfill failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });