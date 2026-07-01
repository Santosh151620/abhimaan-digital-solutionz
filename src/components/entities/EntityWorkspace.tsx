"use client";

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

interface EntityWorkspaceProps {
  activities?: Activity[];
  notes?: Note[];
  tasks?: Task[];
  attachments?: Attachment[];
  notifications?: Notification[];
}

export default function EntityWorkspace({
  activities = [],
  notes = [],
  tasks = [],
  attachments = [],
  notifications = [],
}: EntityWorkspaceProps) {
  return (
    <div className="grid gap-6">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Activity</h2>
        <ActivityPanel activities={activities} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Notes</h2>
        <NotesPanel notes={notes} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <TaskPanel tasks={tasks} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Attachments</h2>
        <AttachmentPanel attachments={attachments} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <NotificationPanel notifications={notifications} />
      </section>
    </div>
  );
}