# ============================================================================
# ADS SUPABASE SCHEMA EXPORT AUDIT
# PowerShell 5.1 Compatible
# ============================================================================

Write-Host ""
Write-Host "===================================================="
Write-Host " ADS SUPABASE SCHEMA EXPORT AUDIT"
Write-Host "===================================================="
Write-Host ""


# Check Supabase CLI

Write-Host "Checking Supabase CLI..."

$supabase = Get-Command supabase -ErrorAction SilentlyContinue


if(!$supabase)
{
    Write-Host ""
    Write-Host "ERROR: Supabase CLI not installed"
    Write-Host ""
    Write-Host "Install:"
    Write-Host "npm install -g supabase"
    exit 1
}


Write-Host "Supabase CLI found"
Write-Host ""


# ----------------------------------------------------
# Generate schema dump
# ----------------------------------------------------

Write-Host "Generating schema dump..."


supabase db dump `
--schema public `
--file supabase-public-schema.sql



if(Test-Path ".\supabase-public-schema.sql")
{
    Write-Host ""
    Write-Host "PASS: Public schema exported"
}
else
{
    Write-Host ""
    Write-Host "FAILED: Schema export failed"
}



# ----------------------------------------------------
# Extract tables
# ----------------------------------------------------

Write-Host ""
Write-Host "Extracting existing tables..."


Select-String `
-Path ".\supabase-public-schema.sql" `
-Pattern "CREATE TABLE" |
Out-File `
".\existing-tables.txt"



# ----------------------------------------------------
# Extract functions
# ----------------------------------------------------

Write-Host ""
Write-Host "Extracting functions..."


Select-String `
-Path ".\supabase-public-schema.sql" `
-Pattern "CREATE FUNCTION" |
Out-File `
".\existing-functions.txt"



# ----------------------------------------------------
# Extract policies
# ----------------------------------------------------

Write-Host ""
Write-Host "Extracting RLS policies..."


Select-String `
-Path ".\supabase-public-schema.sql" `
-Pattern "CREATE POLICY" |
Out-File `
".\existing-rls-policies.txt"



# ----------------------------------------------------
# Extract indexes
# ----------------------------------------------------

Write-Host ""
Write-Host "Extracting indexes..."


Select-String `
-Path ".\supabase-public-schema.sql" `
-Pattern "CREATE INDEX" |
Out-File `
".\existing-indexes.txt"



Write-Host ""
Write-Host "===================================================="
Write-Host " SUPABASE EXPORT COMPLETE"
Write-Host "===================================================="

Write-Host ""

Write-Host "Generated:"
Write-Host "supabase-public-schema.sql"
Write-Host "existing-tables.txt"
Write-Host "existing-functions.txt"
Write-Host "existing-rls-policies.txt"
Write-Host "existing-indexes.txt"