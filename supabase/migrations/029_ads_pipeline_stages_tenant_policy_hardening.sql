BEGIN;

ALTER TABLE public.pipeline_stages
    ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pipeline_stages_tenant_select
    ON public.pipeline_stages;

DROP POLICY IF EXISTS pipeline_stages_tenant_insert
    ON public.pipeline_stages;

DROP POLICY IF EXISTS pipeline_stages_tenant_update
    ON public.pipeline_stages;

DROP POLICY IF EXISTS pipeline_stages_tenant_delete
    ON public.pipeline_stages;

CREATE POLICY pipeline_stages_tenant_select
ON public.pipeline_stages
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = pipeline_stages.organization_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

CREATE POLICY pipeline_stages_tenant_insert
ON public.pipeline_stages
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = pipeline_stages.organization_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

CREATE POLICY pipeline_stages_tenant_update
ON public.pipeline_stages
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = pipeline_stages.organization_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = pipeline_stages.organization_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

CREATE POLICY pipeline_stages_tenant_delete
ON public.pipeline_stages
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = pipeline_stages.organization_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

COMMIT;
