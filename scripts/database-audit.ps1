# ============================================================================
# ADS DATABASE MIGRATION AUDIT
# PowerShell 5.1 Compatible
# ============================================================================

Write-Host ""
Write-Host "===================================================="
Write-Host " ADS DATABASE MIGRATION AUDIT"
Write-Host "===================================================="
Write-Host ""

$Root = Get-Location

Write-Host "Project:"
Write-Host $Root
Write-Host ""

# ----------------------------------------------------
# Migration files
# ----------------------------------------------------

Write-Host "Checking migration files..."

$migrationPath = ".\supabase\migrations"

if (!(Test-Path $migrationPath)) {
    Write-Host "ERROR: migrations folder missing"
    exit 1
}


$migrations = Get-ChildItem `
    $migrationPath `
    -Filter "*.sql" |
    Sort-Object Name


Write-Host ""

Write-Host "Migration count:"
Write-Host $migrations.Count


if ($migrations.Count -lt 40)
{
    Write-Host "WARNING: Expected 40 migrations"
}
else
{
    Write-Host "PASS: Migration count OK"
}



# ----------------------------------------------------
# Empty migration check
# ----------------------------------------------------

Write-Host ""
Write-Host "Checking empty migrations..."

foreach($file in $migrations)
{

    $content = Get-Content $file.FullName -Raw


    if(
        [string]::IsNullOrWhiteSpace($content)
    )
    {
        Write-Host "EMPTY:"
        Write-Host $file.Name
    }

}



# ----------------------------------------------------
# Migration numbering
# ----------------------------------------------------

Write-Host ""
Write-Host "Checking numbering..."

$expected = 1

foreach($file in $migrations)
{

    $number = [int](
        $file.Name.Substring(0,3)
    )


    if($number -ne $expected)
    {
        Write-Host "Mismatch:"
        Write-Host $file.Name
    }


    $expected++

}



# ----------------------------------------------------
# Schema extraction
# ----------------------------------------------------

Write-Host ""
Write-Host "Extracting created schemas..."

$schemas =
Select-String `
-Path "$migrationPath\*.sql" `
-Pattern "CREATE SCHEMA IF NOT EXISTS" |
ForEach-Object {

    $_.Line

}


$schemas | Out-File `
".\database-schema-audit.txt"



Write-Host ""
Write-Host "Schema report created:"
Write-Host "database-schema-audit.txt"



# ----------------------------------------------------
# Table extraction
# ----------------------------------------------------

Write-Host ""
Write-Host "Extracting tables..."

$tables =
Select-String `
-Path "$migrationPath\*.sql" `
-Pattern "CREATE TABLE IF NOT EXISTS" |
ForEach-Object {

    $_.Line

}


$tables | Out-File `
".\database-table-audit.txt"



Write-Host ""
Write-Host "Table report created:"
Write-Host "database-table-audit.txt"



# ----------------------------------------------------
# Function extraction
# ----------------------------------------------------

Write-Host ""
Write-Host "Extracting functions..."

$functions =
Select-String `
-Path "$migrationPath\*.sql" `
-Pattern "CREATE OR REPLACE FUNCTION" |
ForEach-Object {

    $_.Line

}


$functions | Out-File `
".\database-function-audit.txt"



Write-Host ""
Write-Host "Function report created:"
Write-Host "database-function-audit.txt"



# ----------------------------------------------------
# Index extraction
# ----------------------------------------------------

Write-Host ""
Write-Host "Extracting indexes..."

$indexes =
Select-String `
-Path "$migrationPath\*.sql" `
-Pattern "CREATE INDEX IF NOT EXISTS" |
ForEach-Object {

    $_.Line

}


$indexes | Out-File `
".\database-index-audit.txt"



Write-Host ""
Write-Host "Index report created:"
Write-Host "database-index-audit.txt"



Write-Host ""
Write-Host "===================================================="
Write-Host " DATABASE AUDIT COMPLETE"
Write-Host "===================================================="