-- AlterTable
ALTER TABLE "user" ADD COLUMN     "projectActivityNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "systemNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "taskCompletedNotifications" BOOLEAN NOT NULL DEFAULT true;
