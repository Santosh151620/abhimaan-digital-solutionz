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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // TODO:
    // Load entity-specific data here.
    // Example:
    // activityService.getByEntity(entityType, entityId).then(setActivities);
    // notesService.getByEntity(entityType, entityId).then(setNotes);
    // tasksService.getByEntity(entityType, entityId).then(setTasks);
    // attachmentsService.getByEntity(entityType, entityId).then(setAttachments);
    // notificationsService.getByEntity(entityType, entityId).then(setNotifications);
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