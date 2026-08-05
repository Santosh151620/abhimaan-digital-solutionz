$ErrorActionPreference = "Stop"

$rlsFile = ".\supabase\migrations\010_rls.sql"
$schemaFile = ".\supabase\migrations\003_crm.sql"

$backup = "$rlsFile.child-rls-backup-$(Get-Date -Format yyyyMMdd-HHmmss)"

Copy-Item $rlsFile $backup

Write-Host "Backup created:"
Write-Host $backup


$schema = Get-Content $schemaFile -Raw
$rls = Get-Content $rlsFile -Raw


$tables = [regex]::Matches(
    $schema,
    "CREATE TABLE IF NOT EXISTS\s+([a-zA-Z0-9_]+)"
) |
ForEach-Object {
    $_.Groups[1].Value
}


$patch = @()

$patch += @"

-- ============================================================
-- COMPLETE CRM CHILD TABLE TENANT SECURITY PATCH
-- ============================================================

"@


foreach($table in $tables)
{

    $tableBlock = ""

    $pattern = "(?s)CREATE TABLE IF NOT EXISTS\s+$table.*?;"


    $match = [regex]::Match(
        $schema,
        $pattern
    )


    if($match.Success)
    {
        $tableBlock = $match.Value
    }


    if(
        $tableBlock -match "organization_id"
    )
    {

        if(
            $rls -notmatch "ALTER TABLE\s+$table\s+ENABLE ROW LEVEL SECURITY"
        )
        {
            Write-Host "Adding RLS:"
            Write-Host $table

            $patch += @"
ALTER TABLE $table ENABLE ROW LEVEL SECURITY;

"@
        }


        if(
            $rls -notmatch "apply_crm_tenant_policy\('$table'\)"
        )
        {
            Write-Host "Adding policy:"
            Write-Host $table

            $patch += @"
SELECT apply_crm_tenant_policy('$table');

"@
        }
    }
}


if($patch.Count -gt 2)
{

    $marker = "-- FINAL RLS VALIDATION"

    if(
        $rls.Contains($marker)
    )
    {

        $newContent =
            $rls.Replace(
                $marker,
                ($patch -join "`n") + "`n" + $marker
            )

    }
    else
    {

        Write-Host "Final marker not found. Appending before COMMIT."

        $newContent =
            $rls.Replace(
                "COMMIT;",
                ($patch -join "`n") + "`nCOMMIT;"
            )
    }


    Set-Content `
        -Path $rlsFile `
        -Value $newContent `
        -Encoding UTF8


    Write-Host ""
    Write-Host "CRM child RLS extension completed."
}
else
{
    Write-Host "No missing CRM child RLS found."
}