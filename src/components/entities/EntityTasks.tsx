"use client";

import TaskPanel from "./TaskPanel";
import type { Task } from "@/types/crm/Tasks";

interface EntityTasksProps {
    tasks: Task[];
}

function EntityTasks({
    tasks,
}: EntityTasksProps) {

    return (
        <TaskPanel
            tasks={tasks}
        />
    );
}

