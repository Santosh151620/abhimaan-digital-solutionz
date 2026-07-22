"use client";

import AttachmentPanel from "./AttachmentPanel";
import type { Attachment } from "@/types/attachments";

interface EntityAttachmentsProps {
    attachments: Attachment[];
}

export default function EntityAttachments({
    attachments,
}: EntityAttachmentsProps) {

    return (
        <AttachmentPanel
            attachments={attachments}
        />
    );
}