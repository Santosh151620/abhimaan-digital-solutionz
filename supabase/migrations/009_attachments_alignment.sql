BEGIN;

ALTER TABLE public.attachments

ADD COLUMN IF NOT EXISTS description text,

ADD COLUMN IF NOT EXISTS archived boolean DEFAULT false,

ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),

ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();



UPDATE public.attachments
SET
    archived = false
WHERE archived IS NULL;



UPDATE public.attachments
SET
    created_at = uploaded_at
WHERE created_at IS NULL;



UPDATE public.attachments
SET
    updated_at = uploaded_at
WHERE updated_at IS NULL;



CREATE INDEX IF NOT EXISTS idx_attachments_entity
ON public.attachments(entity_type, entity_id);



CREATE INDEX IF NOT EXISTS idx_attachments_uploaded_by
ON public.attachments(uploaded_by);



CREATE INDEX IF NOT EXISTS idx_attachments_archived
ON public.attachments(archived);



COMMIT;