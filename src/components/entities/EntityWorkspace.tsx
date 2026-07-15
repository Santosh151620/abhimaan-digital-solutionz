"use client";

import type { ReactNode } from "react";

import type { Activity } from "@/types/activity";
import type { Attachment } from "@/types/attachments";
import type { Note } from "@/types/notes";
import type { Notification } from "@/types/notifications";
import type { Task } from "@/types/tasks";

import ActivityPanel from "./ActivityPanel";
import AttachmentPanel from "./AttachmentPanel";
import NotesPanel from "./NotesPanel";
import NotificationPanel from "./NotificationPanel";
import TaskPanel from "./TaskPanel";

export interface EntityWorkspaceProps {
  entityType?: string;
  entityId?: string;

  overview?: ReactNode;
  timeline?: ReactNode;

  activities?: Activity[];
  notes?: Note[];
  tasks?: Task[];
  attachments?: Attachment[];
  notifications?: Notification[];
}

export default function EntityWorkspace({
  entityType,
  entityId,
  overview,
  timeline,
  activities = [],
  notes = [],
  tasks = [],
  attachments = [],
  notifications = [],
}: EntityWorkspaceProps) {
  return (
    <div className="space-y-6">
      {(entityType || entityId) && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-slate-500">Entity Type</span>

              <div className="font-medium text-white">
                {entityType ?? "-"}
              </div>
            </div>

            <div>
              <span className="text-slate-500">Entity ID</span>

              <div className="break-all font-medium text-white">
                {entityId ?? "-"}
              </div>
            </div>
          </div>
        </div>
      )}

      {overview}

      {timeline}

      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-5">
        <h2 className="text-lg font-semibold text-white">
          Activity
        </h2>

        <ActivityPanel activities={activities} />
      </section>

      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-5">
        <h2 className="text-lg font-semibold text-white">
          Notes
        </h2>

        <NotesPanel notes={notes} />
      </section>

      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-5">
        <h2 className="text-lg font-semibold text-white">
          Tasks
        </h2>

        <TaskPanel tasks={tasks} />
      </section>

      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-5">
        <h2 className="text-lg font-semibold text-white">
          Attachments
        </h2>

        <AttachmentPanel attachments={attachments} />
      </section>

      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-5">
        <h2 className="text-lg font-semibold text-white">
          Notifications
        </h2>

        <NotificationPanel notifications={notifications} />
      </section>
    </div>
  );
}




