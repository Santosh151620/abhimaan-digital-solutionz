$ErrorActionPreference = "Stop"

$file = ".\supabase\migrations\010_rls.sql"

$backup = "$file.restore-function-backup-$(Get-Date -Format yyyyMMdd-HHmmss)"

Copy-Item $file $backup

Write-Host "Backup created:"
Write-Host $backup


$content = Get-Content $file -Raw


if($content -match "CREATE OR REPLACE FUNCTION apply_crm_tenant_policy")
{
    Write-Host "Function already exists. Nothing to do."
    exit
}


$functionBlock = @'

CREATE OR REPLACE FUNCTION apply_crm_tenant_policy(
    target_table TEXT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$

BEGIN

EXECUTE format(
'
DROP POLICY IF EXISTS %I ON %I;

CREATE POLICY %I
ON %I
FOR ALL
TO authenticated

USING
(
 user_has_organization_access(
 organization_id
 )
 OR
 is_platform_admin()
)

WITH CHECK
(
 user_has_organization_access(
 organization_id
 )
 OR
 is_platform_admin()
);

',

target_table || '_tenant_policy',
target_table,
target_table || '_tenant_policy',
target_table

);

END;

$$;


'@


$marker = "SELECT apply_crm_tenant_policy"


if($content -notmatch $marker)
{
    throw "apply_crm_tenant_policy calls not found"
}


$content = $content -replace `
"SELECT apply_crm_tenant_policy", `
"$functionBlock`r`n`r`nSELECT apply_crm_tenant_policy"


Set-Content `
-Path $file `
-Value $content `
-Encoding UTF8


Write-Host ""
Write-Host "CRM tenant policy function restored successfully."