"use client";

import type { Task } from "@/types/tasks";

interface TaskPanelProps {
  tasks: Task[];
}

export default function TaskPanel({
  tasks,
}: TaskPanelProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border p-4 text-sm text-gray-500">
        No tasks available.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="rounded-lg border p-4"
        >
          <div className="font-medium">
            {task.title}
          </div>

          <div className="mt-1 text-sm">
            {task.status} • {task.priority}
          </div>
        </div>
      ))}
    </div>
  );
}