$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================="
Write-Host "Sprint 0 - Database Baseline"
Write-Host "========================================="
Write-Host ""

Write-Host "Checking Supabase CLI..."

supabase --version

Write-Host ""
Write-Host "Linking project..."

supabase link --project-ref owtjpapkbwdwkpqwpvhx

Write-Host ""
Write-Host "Creating baseline migration..."

supabase db pull

Write-Host ""
Write-Host "Migration status..."

supabase migration list

Write-Host ""
Write-Host "Done."