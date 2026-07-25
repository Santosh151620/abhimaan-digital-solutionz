import type { EntityReference } from "@/types/platform/Ownership";

export type AttachmentType =
  | "IMAGE"
  | "DOCUMENT"
  | "VIDEO"
  | "AUDIO"
  | "ARCHIVE"
  | "OTHER";

export interface Attachment extends EntityReference {
  id: string;

  fileName: string;
  fileUrl: string;
  fileType: AttachmentType;

  mimeType?: string;
  size?: number;

  uploadedAt: string;
  uploadedBy?: string | null;
}





