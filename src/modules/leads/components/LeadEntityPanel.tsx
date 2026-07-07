"use client";

import EntityWorkspace from "@/components/entities/EntityWorkspace";
import { useEffect, useState } from "react";

import {
  LEAD_ENTITY_TYPE,
  type LeadEntity,
} from "../types/lead.entity";

import type { Activity } from "@/types/activity";
import type { Note } from "@/types/notes";
import type { Task } from "@/types/tasks";
import type { Attachment } from "@/types/attachments";
import type { Notification } from "@/types/notifications";

interface LeadEntityPanelProps {
  lead: LeadEntity;
}

export default function LeadEntityPanel({
  lead,
}: LeadEntityPanelProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!lead.entityId) return;

    async function loadEntityData() {
      const query = `entityType=${LEAD_ENTITY_TYPE}&entityId=${lead.entityId}`;

      const [
        activityResponse,
        notesResponse,
        tasksResponse,
        attachmentsResponse,
        notificationsResponse,
      ] = await Promise.all([
        fetch(`/api/entities/activity?${query}`),
        fetch(`/api/entities/notes?${query}`),
        fetch(`/api/entities/tasks?${query}`),
        fetch(`/api/entities/attachments?${query}`),
        fetch(`/api/entities/notifications?${query}`),
      ]);

      const [
        activityData,
        notesData,
        tasksData,
        attachmentsData,
        notificationsData,
      ] = await Promise.all([
        activityResponse.json(),
        notesResponse.json(),
        tasksResponse.json(),
        attachmentsResponse.json(),
        notificationsResponse.json(),
      ]);

      setActivities(activityData.data ?? activityData ?? []);
      setNotes(notesData.data ?? notesData ?? []);
      setTasks(tasksData.data ?? tasksData ?? []);
      setAttachments(attachmentsData.data ?? attachmentsData ?? []);
      setNotifications(
        notificationsData.data ?? notificationsData ?? [],
      );
    }

    loadEntityData();
  }, [lead.entityId]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {lead.title}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {lead.email ?? "No email"}
            </p>
          </div>

          <div className="rounded-lg bg-cyan-600/20 px-3 py-2 text-sm font-medium text-cyan-300">
            {lead.status}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Phone
            </p>
            <p className="text-white">
              {lead.phone ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Source
            </p>
            <p className="text-white">
              {lead.source ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Score
            </p>
            <p className="text-white">
              {lead.score ?? 0}
            </p>
          </div>
        </div>
      </div>

      <EntityWorkspace
        entityType={LEAD_ENTITY_TYPE}
        entityId={lead.entityId}
        activities={activities}
        notes={notes}
        tasks={tasks}
        attachments={attachments}
        notifications={notifications}
      />
    </div>
  );
}