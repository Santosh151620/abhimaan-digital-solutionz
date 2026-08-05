$ErrorActionPreference = "Stop"

$file = ".\supabase\migrations\010_rls.sql"

$backup = "$file.before-policy-call-cleanup-$(Get-Date -Format yyyyMMdd-HHmmss)"

Copy-Item $file $backup

Write-Host "Backup created:"
Write-Host $backup


$content = Get-Content $file -Raw


$tables = @(
"lead_sources",
"lead_statuses",
"sales_forecasts",
"product_categories",
"product_inventory",
"credit_notes",
"refunds",
"revenue_recognition",
"ticket_categories",
"ticket_priorities",
"sla_definitions",
"ai_assistants",
"ai_conversations",
"ai_messages",
"ai_prompts",
"ai_recommendations",
"workflow_definitions",
"dashboards",
"kpi_definitions",
"reports",
"executive_snapshots",
"forecast_models",
"notifications",
"saved_filters",
"custom_fields"
)


foreach($table in $tables)
{
    $pattern = "(?m)^SELECT apply_crm_tenant_policy\('$table'\);\r?\n"

    $matches = [regex]::Matches($content,$pattern)

    if($matches.Count -gt 1)
    {
        Write-Host "Removing duplicates for $table"

        $first = $true

        $content = [regex]::Replace(
            $content,
            $pattern,
            {
                param($m)

                if($script:first)
                {
                    $script:first=$false
                    return $m.Value
                }

                return ""
            }
        )

        $script:first=$true
    }
}


Set-Content `
-Path $file `
-Value $content `
-Encoding UTF8


Write-Host ""
Write-Host "Duplicate CRM policy calls removed."