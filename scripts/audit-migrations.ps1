#Requires -Version 5.1

$ErrorActionPreference = "Stop"

$Root = Join-Path $PSScriptRoot "..\supabase\migrations"
$Root = (Resolve-Path $Root).Path

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " ADS ENTERPRISE MIGRATION QA AUDIT (001-040)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

$Results = @()

foreach ($File in (Get-ChildItem $Root -Filter *.sql | Sort-Object Name))
{
    $Content = Get-Content $File.FullName -Raw

    $Issues = @()

    $BeginCount  = ([regex]::Matches($Content,'(?im)^\s*BEGIN\s*;')).Count
    $CommitCount = ([regex]::Matches($Content,'(?im)^\s*COMMIT\s*;')).Count

    if($BeginCount -ne 1){ $Issues += "BEGIN=$BeginCount" }
    if($CommitCount -ne 1){ $Issues += "COMMIT=$CommitCount" }

    if($Content -notmatch 'CREATE SCHEMA IF NOT EXISTS')
    {
        $Issues += "Missing CREATE SCHEMA"
    }

    if($Content -match 'CREATE TABLE' -and
       $Content -notmatch 'CREATE TABLE IF NOT EXISTS')
    {
        $Issues += "Non-idempotent CREATE TABLE"
    }

    if($Content -match 'CREATE INDEX' -and
       $Content -notmatch 'CREATE INDEX IF NOT EXISTS')
    {
        $Issues += "Non-idempotent CREATE INDEX"
    }

    if($Content -match 'CREATE TRIGGER')
    {
        if($Content -notmatch 'DROP TRIGGER IF EXISTS')
        {
            $Issues += "Trigger not idempotent"
        }
    }

    if($Content -match 'updated_at')
    {
        if($Content -notmatch 'set_updated_at')
        {
            $Issues += "updated_at trigger missing"
        }
    }

    if($Content -match 'INSERT INTO rollback\.deployment_history')
    {
        if($Content -notmatch 'ON CONFLICT')
        {
            $Issues += "Deployment registration not idempotent"
        }
    }

    $Score = 100 - ($Issues.Count * 5)

    if($Score -lt 0){ $Score = 0 }

    if($Issues.Count -eq 0)
    {
        $Status = "PASS"
    }
    elseif($Issues.Count -le 2)
    {
        $Status = "WARN"
    }
    elseif($Issues.Count -le 5)
    {
        $Status = "FIX"
    }
    else
    {
        $Status = "REPLACE"
    }

    $Results += [PSCustomObject]@{
        Migration = $File.Name
        Score     = $Score
        Status    = $Status
        Issues    = ($Issues -join "; ")
    }
}

$Results |
Sort-Object Migration |
Format-Table -AutoSize

$Results |
Export-Csv ".\Migration-QA-Report.csv" -NoTypeInformation

$Results |
ConvertTo-Json -Depth 5 |
Set-Content ".\Migration-QA-Report.json"

$Results |
Out-String |
Set-Content ".\Migration-QA-Report.txt"

$Markdown = @()
$Markdown += "# ADS Migration QA Report"
$Markdown += ""
$Markdown += "| Migration | Score | Status | Issues |"
$Markdown += "|-----------|------:|--------|--------|"

foreach($R in $Results)
{
    $Markdown += "| $($R.Migration) | $($R.Score) | $($R.Status) | $($R.Issues) |"
}

$Markdown |
Set-Content ".\Migration-QA-Report.md"

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Audit Complete"
Write-Host "==========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Generated:"
Write-Host "  Migration-QA-Report.csv"
Write-Host "  Migration-QA-Report.json"
Write-Host "  Migration-QA-Report.md"
Write-Host "  Migration-QA-Report.txt"