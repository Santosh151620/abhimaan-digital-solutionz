"use client";

import { useEffect, useState } from "react";

import type { Activity } from "@/types/activity";
import type { Attachment } from "@/types/attachments";
import type { Note } from "@/types/notes";
import type { Notification } from "@/types/notifications";
import type { Task } from "@/types/tasks";

import EntityWorkspace from "./EntityWorkspace";

interface Props {
  entityType: string;
  entityId: string;
}

export default function EntityWorkspaceContainer({
  entityType,
  entityId,
}: Props) {
  const [activities] = useState<Activity[]>([]);
  const [notes] = useState<Note[]>([]);
  const [tasks] = useState<Task[]>([]);
  const [attachments] = useState<Attachment[]>([]);
  const [notifications] = useState<Notification[]>([]);

  useEffect(() => {
     }, [entityType, entityId]);

  return (
    <EntityWorkspace
      entityType={entityType}
      entityId={entityId}
      activities={activities}
      notes={notes}
      tasks={tasks}
      attachments={attachments}
      notifications={notifications}
    />
  );
}
