# ============================================================================
# ADS MIGRATION OBJECT DEPENDENCY REPORT
# PowerShell 5.1 Compatible
# READ ONLY - LOCAL ANALYSIS ONLY
# ============================================================================

Write-Host ""
Write-Host "===================================================="
Write-Host " ADS MIGRATION OBJECT DEPENDENCY REPORT"
Write-Host "===================================================="
Write-Host ""


$migrationPath = ".\supabase\migrations"


if(!(Test-Path $migrationPath))
{
    Write-Host "ERROR: Migration folder missing"
    exit 1
}



# ----------------------------------------------------
# Extract schemas
# ----------------------------------------------------

Write-Host "Extracting schemas..."


Select-String `
-Path "$migrationPath\*.sql" `
-Pattern "CREATE SCHEMA" |
ForEach-Object {

    $_.Line.Trim()

} |
Out-File `
".\report-schemas.txt"



# ----------------------------------------------------
# Extract tables
# ----------------------------------------------------

Write-Host "Extracting tables..."


Select-String `
-Path "$migrationPath\*.sql" `
-Pattern "CREATE TABLE" |
ForEach-Object {

    $_.Line.Trim()

} |
Out-File `
".\report-tables.txt"



# ----------------------------------------------------
# Extract views
# ----------------------------------------------------

Write-Host "Extracting views..."


Select-String `
-Path "$migrationPath\*.sql" `
-Pattern "CREATE OR REPLACE VIEW" |
ForEach-Object {

    $_.Line.Trim()

} |
Out-File `
".\report-views.txt"



# ----------------------------------------------------
# Extract functions
# ----------------------------------------------------

Write-Host "Extracting functions..."


Select-String `
-Path "$migrationPath\*.sql" `
-Pattern "CREATE OR REPLACE FUNCTION" |
ForEach-Object {

    $_.Line.Trim()

} |
Out-File `
".\report-functions.txt"



# ----------------------------------------------------
# Extract triggers
# ----------------------------------------------------

Write-Host "Extracting triggers..."


Select-String `
-Path "$migrationPath\*.sql" `
-Pattern "CREATE TRIGGER" |
ForEach-Object {

    $_.Line.Trim()

} |
Out-File `
".\report-triggers.txt"



# ----------------------------------------------------
# Extract policies
# ----------------------------------------------------

Write-Host "Extracting policies..."


Select-String `
-Path "$migrationPath\*.sql" `
-Pattern "CREATE POLICY" |
ForEach-Object {

    $_.Line.Trim()

} |
Out-File `
".\report-policies.txt"



# ----------------------------------------------------
# Extract indexes
# ----------------------------------------------------

Write-Host "Extracting indexes..."


Select-String `
-Path "$migrationPath\*.sql" `
-Pattern "CREATE INDEX" |
ForEach-Object {

    $_.Line.Trim()

} |
Out-File `
".\report-indexes.txt"



# ----------------------------------------------------
# Extract foreign keys
# ----------------------------------------------------

Write-Host "Extracting foreign keys..."


Select-String `
-Path "$migrationPath\*.sql" `
-Pattern "FOREIGN KEY" |
ForEach-Object {

    $_.Line.Trim()

} |
Out-File `
".\report-foreign-keys.txt"



Write-Host ""

Write-Host "===================================================="
Write-Host " REPORT COMPLETE"
Write-Host "===================================================="

Write-Host ""

Write-Host "Generated:"
Write-Host ""
Write-Host "report-schemas.txt"
Write-Host "report-tables.txt"
Write-Host "report-views.txt"
Write-Host "report-functions.txt"
Write-Host "report-triggers.txt"
Write-Host "report-policies.txt"
Write-Host "report-indexes.txt"
Write-Host "report-foreign-keys.txt"