"use client";

import { useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";
import { Calendar, GripVertical } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import type { TaskPriority, TaskStatus } from "@prisma/client";

import { cn } from "@/lib/utils";

import { updateTaskStatus } from "../actions/update-task-status";
import { TaskCommentsDialog } from "@/features/comments/components/task-comments-dialog";
import { EditTaskDialog } from "./edit-task-dialog";
import { getPriorityBadge } from "./task-card";

interface ProjectOption {
  id: string;
  name: string;
  members: { id: string; name: string }[];
}

export interface BoardTask {
  id: string;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  projectId: string;
  assignee: { id: string; name: string } | null;
  isPastDue: boolean;
  commentCount: number;
}

const COLUMNS: { status: TaskStatus; label: string; dot: string }[] = [
  { status: "TODO", label: "To Do", dot: "bg-slate-400" },
  { status: "IN_PROGRESS", label: "In Progress", dot: "bg-amber-500" },
  { status: "DONE", label: "Done", dot: "bg-emerald-500" },
];

function isOverdue(task: BoardTask) {
  return task.isPastDue && task.status !== "DONE";
}

/** What a card looks like (also used for the floating copy while dragging). */
function CardBody({ task }: { task: BoardTask }) {
  const priority = getPriorityBadge(task.priority);

  return (
    <div className="min-w-0 space-y-2">
      <p className="text-sm font-semibold text-slate-900">{task.name}</p>

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${priority.className}`}
        >
          {priority.label}
        </span>

        {task.dueDate && (
          <span
            className={cn(
              "flex items-center gap-1 text-xs",
              isOverdue(task) ? "font-medium text-red-600" : "text-slate-500",
            )}
          >
            <Calendar className="h-3 w-3" />
            {task.dueDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              timeZone: "UTC",
            })}
            {isOverdue(task) && " . Overdue"}
          </span>
        )}

        {task.assignee && (
          <span
            title={task.assignee.name}
            className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700"
          >
            {task.assignee.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
}

function DraggableCard({
  task,
  projects,
}: {
  task: BoardTask;
  projects: ProjectOption[];
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-xl border bg-white p-3 shadow-sm",
        isOverdue(task) ? "border-red-200" : "border-slate-200",
        isDragging && "opacity-40",
      )}
    >
      <div className="flex items-start gap-2">
        {/* Only the grip handle starts a drag, so the rest of the card
            still scrolls normally on touch screens. */}
        <button
          type="button"
          aria-label={`Drag task ${task.name}`}
          className="mt-0.5 shrink-0 cursor-grab touch-none text-slate-400 hover:text-slate-600"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="min-w-0 flex-1">
          <CardBody task={task} />
        </div>

                <div className="flex shrink-0 items-center gap-1">
          <TaskCommentsDialog
            taskId={task.id}
            taskName={task.name}
            commentCount={task.commentCount}
            compact
          />

          <EditTaskDialog
            id={task.id}
            name={task.name}
            description={task.description}
            status={task.status}
            priority={task.priority}
            dueDate={task.dueDate}
            projectId={task.projectId}
            assigneeId={task.assignee?.id ?? null}
            projects={projects}
          />
        </div>
      </div>
    </div>
  );
}

function BoardColumn({
  status,
  label,
  dot,
  tasks,
  projects,
}: {
  status: TaskStatus;
  label: string;
  dot: string;
  tasks: BoardTask[];
  projects: ProjectOption[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[240px] flex-col rounded-2xl border border-slate-200 bg-slate-50 p-3 transition-colors",
        isOver && "border-blue-300 bg-blue-50",
      )}
    >
      <div className="flex items-center gap-2 px-1">
        <span className={cn("h-2.5 w-2.5 rounded-full", dot)} />
        <h3 className="text-sm font-semibold text-slate-800">{label}</h3>
        <span className="ml-auto text-xs font-medium text-slate-500">
          {tasks.length}
        </span>
      </div>

      <div className="mt-3 space-y-3">
        {tasks.map((task) => (
          <DraggableCard key={task.id} task={task} projects={projects} />
        ))}

        {tasks.length === 0 && (
          <p className="py-6 text-center text-xs text-slate-400">
            Drop tasks here
          </p>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({
  tasks,
  projects,
}: {
  tasks: BoardTask[];
  projects: ProjectOption[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // The board shows the server's tasks, plus any move still being saved.
  // When the save finishes, it automatically switches to fresh server data.
  // If the save fails, the card falls back to where the server says it is.
  const [optimisticTasks, moveTaskOptimistically] = useOptimistic(
    tasks,
    (current, move: { id: string; status: TaskStatus }) =>
      current.map((task) =>
        task.id === move.id ? { ...task, status: move.status } : task,
      ),
  );

  const sensors = useSensors(
    // Must drag 6px before it counts, so a simple click never starts a drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const activeTask = optimisticTasks.find((task) => task.id === activeId);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);

    const { active, over } = event;

    if (!over) {
      return;
    }

    const nextStatus = COLUMNS.find((column) => column.status === over.id)
      ?.status;

    if (!nextStatus) {
      return;
    }

    const taskId = String(active.id);
    const task = optimisticTasks.find((item) => item.id === taskId);

    if (!task || task.status === nextStatus) {
      return;
    }

    startTransition(async () => {
      moveTaskOptimistically({ id: taskId, status: nextStatus });

      const result = await updateTaskStatus(taskId, nextStatus);

      if (result.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <DndContext
      id="project-kanban-board"
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((column) => (
          <BoardColumn
            key={column.status}
            status={column.status}
            label={column.label}
            dot={column.dot}
            projects={projects}
            tasks={optimisticTasks.filter(
              (task) => task.status === column.status,
            )}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rounded-xl border border-blue-300 bg-white p-3 shadow-lg">
            <CardBody task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}