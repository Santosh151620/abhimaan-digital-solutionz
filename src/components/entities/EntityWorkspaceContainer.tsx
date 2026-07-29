"use client";

import { useState } from "react";

import type { Activity } from "@/types/crm/Activity";
import type { Attachment } from "@/types/crm/Attachment";
import type { Note } from "@/types/notes";
import type { Notification } from "@/types/crm/Notifications";
import type { Task } from "@/types/crm/Tasks";

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






