"use client";

import AttachmentPanel from "./AttachmentPanel";
import type { Attachment } from "@/types/crm/Attachment";

interface EntityAttachmentsProps {
    attachments: Attachment[];
}

function EntityAttachments({
    attachments,
}: EntityAttachmentsProps) {

    return (
        <AttachmentPanel
            attachments={attachments}
        />
    );
}

