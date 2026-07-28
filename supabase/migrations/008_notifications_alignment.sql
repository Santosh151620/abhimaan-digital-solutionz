BEGIN;

ALTER TABLE public.notifications

ADD COLUMN IF NOT EXISTS organization_id uuid,

ADD COLUMN IF NOT EXISTS notification_number text,

ADD COLUMN IF NOT EXISTS owner_id uuid,

ADD COLUMN IF NOT EXISTS user_id uuid,

ADD COLUMN IF NOT EXISTS priority text DEFAULT 'Medium',

ADD COLUMN IF NOT EXISTS status text DEFAULT 'Unread',

ADD COLUMN IF NOT EXISTS action_url text,

ADD COLUMN IF NOT EXISTS action_label text,

ADD COLUMN IF NOT EXISTS icon text,

ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb,

ADD COLUMN IF NOT EXISTS archived boolean DEFAULT false,

ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();



UPDATE public.notifications
SET
    status =
        CASE
            WHEN is_read = true
                THEN 'Read'
            ELSE 'Unread'
        END
WHERE status IS NULL;



UPDATE public.notifications
SET
    priority = 'Medium'
WHERE priority IS NULL;



UPDATE public.notifications
SET
    archived = false
WHERE archived IS NULL;



UPDATE public.notifications
SET
    updated_at = created_at
WHERE updated_at IS NULL;



UPDATE public.notifications
SET
    notification_number =
        CONCAT(
            'NTF-',
            id::text
        )
WHERE notification_number IS NULL;



CREATE INDEX IF NOT EXISTS idx_notifications_organization
ON public.notifications(organization_id);



CREATE INDEX IF NOT EXISTS idx_notifications_entity
ON public.notifications(entity_type, entity_id);



CREATE INDEX IF NOT EXISTS idx_notifications_user
ON public.notifications(user_id);



CREATE INDEX IF NOT EXISTS idx_notifications_status
ON public.notifications(status);



COMMIT;