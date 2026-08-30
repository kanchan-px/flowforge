-- CreateTable
CREATE TABLE "task_status_history" (
    "id" TEXT NOT NULL,
    "fromStatus" "TaskStatus",
    "toStatus" "TaskStatus" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taskId" TEXT NOT NULL,

    CONSTRAINT "task_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "task_status_history_taskId_idx" ON "task_status_history"("taskId");

-- CreateIndex
CREATE INDEX "task_status_history_changedAt_idx" ON "task_status_history"("changedAt");

-- CreateIndex
CREATE INDEX "task_status_history_toStatus_idx" ON "task_status_history"("toStatus");

-- AddForeignKey
ALTER TABLE "task_status_history" ADD CONSTRAINT "task_status_history_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
