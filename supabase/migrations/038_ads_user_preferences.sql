-- ============================================================
-- ADS USER PREFERENCES
-- Migration: 038
--
-- Purpose:
--   Dedicated per-user presentation/application preferences.
--
-- Ownership:
--   User preference data belongs to the user's organization.
--
-- IMPORTANT:
--   Do not store these fields in profiles.
--   Theme governance remains separate from user preference data.
-- ============================================================


CREATE TABLE IF NOT EXISTS user_preferences
(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id uuid NOT NULL,

    organization_id uuid NOT NULL,

    theme varchar(50) NOT NULL
        DEFAULT 'ads-midnight',

    language varchar(10) NOT NULL
        DEFAULT 'en',

    timezone varchar(100),

    compact_mode boolean NOT NULL
        DEFAULT false,

    reduced_motion boolean NOT NULL
        DEFAULT false,

    high_contrast boolean NOT NULL
        DEFAULT false,

    email_notifications boolean NOT NULL
        DEFAULT true,

    push_notifications boolean NOT NULL
        DEFAULT true,

    system_notifications boolean NOT NULL
        DEFAULT true,

    default_landing_page varchar(255),

    dashboard_layout jsonb NOT NULL
        DEFAULT '{}'::jsonb,

    metadata jsonb NOT NULL
        DEFAULT '{}'::jsonb,

    created_at timestamptz NOT NULL
        DEFAULT now(),

    updated_at timestamptz NOT NULL
        DEFAULT now(),

    CONSTRAINT uq_user_preferences_user
        UNIQUE (
            organization_id,
            user_id
        ),

    CONSTRAINT fk_user_preferences_user
        FOREIGN KEY (user_id)
        REFERENCES profiles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_preferences_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_user_preferences_theme
        CHECK (
            theme IN (
                'ads-midnight',
                'ads-azure',
                'ads-platinum'
            )
        ),

    CONSTRAINT chk_user_preferences_language
        CHECK (
            language IN (
                'en',
                'hi',
                'mr',
                'ta',
                'te'
            )
        )
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS
    idx_user_preferences_organization
ON user_preferences (
    organization_id
);

CREATE INDEX IF NOT EXISTS
    idx_user_preferences_user
ON user_preferences (
    user_id
);


-- ============================================================
-- UPDATED-AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_user_preferences_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


DROP TRIGGER IF EXISTS
    trg_user_preferences_updated
ON user_preferences;


CREATE TRIGGER
    trg_user_preferences_updated

BEFORE UPDATE
ON user_preferences

FOR EACH ROW

EXECUTE FUNCTION update_user_preferences_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE user_preferences
ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- RLS POLICIES
--
-- A user may access only their own preferences inside their
-- current organization.
--
-- Organization membership remains the tenant boundary.
-- ============================================================

DROP POLICY IF EXISTS
    user_preferences_select
ON user_preferences;

CREATE POLICY
    user_preferences_select

ON user_preferences

FOR SELECT

TO authenticated

USING
(
    user_id = auth.uid()

    AND

    EXISTS
    (
        SELECT 1
        FROM organization_members om
        WHERE om.organization_id =
            user_preferences.organization_id

        AND om.profile_id =
            auth.uid()

        AND om.is_active = true
    )
);


DROP POLICY IF EXISTS
    user_preferences_insert
ON user_preferences;

CREATE POLICY
    user_preferences_insert

ON user_preferences

FOR INSERT

TO authenticated

WITH CHECK
(
    user_id = auth.uid()

    AND

    EXISTS
    (
        SELECT 1
        FROM organization_members om
        WHERE om.organization_id =
            user_preferences.organization_id

        AND om.profile_id =
            auth.uid()

        AND om.is_active = true
    )
);


DROP POLICY IF EXISTS
    user_preferences_update
ON user_preferences;

CREATE POLICY
    user_preferences_update

ON user_preferences

FOR UPDATE

TO authenticated

USING
(
    user_id = auth.uid()

    AND

    EXISTS
    (
        SELECT 1
        FROM organization_members om
        WHERE om.organization_id =
            user_preferences.organization_id

        AND om.profile_id =
            auth.uid()

        AND om.is_active = true
    )
)

WITH CHECK
(
    user_id = auth.uid()

    AND

    EXISTS
    (
        SELECT 1
        FROM organization_members om
        WHERE om.organization_id =
            user_preferences.organization_id

        AND om.profile_id =
            auth.uid()

        AND om.is_active = true
    )
);


DROP POLICY IF EXISTS
    user_preferences_delete
ON user_preferences;

CREATE POLICY
    user_preferences_delete

ON user_preferences

FOR DELETE

TO authenticated

USING
(
    user_id = auth.uid()

    AND

    EXISTS
    (
        SELECT 1
        FROM organization_members om
        WHERE om.organization_id =
            user_preferences.organization_id

        AND om.profile_id =
            auth.uid()

        AND om.is_active = true
    )
);