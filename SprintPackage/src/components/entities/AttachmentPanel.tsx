"use client";

import type { Attachment } from "@/types/attachments";

interface AttachmentPanelProps {
  attachments: Attachment[];
}

export default function AttachmentPanel({
  attachments,
}: AttachmentPanelProps) {
  if (attachments.length === 0) {
    return (
      <div className="rounded-lg border p-4 text-sm text-gray-500">
        No attachments available.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="rounded-lg border p-4"
        >
          <div className="font-medium">
            {attachment.fileName}
          </div>

          <a
            href={attachment.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            Open File
          </a>
        </div>
      ))}
    </div>
  );
}
