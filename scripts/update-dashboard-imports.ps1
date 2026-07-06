$ErrorActionPreference = "Stop"

$replacements = @{
    "@/components/dashboard/AnalyticsCards" = "@/modules/dashboard/components/AnalyticsCards"
    "@/components/dashboard/KPICard" = "@/modules/dashboard/components/KPICard"
    "@/components/dashboard/LeadModal" = "@/modules/leads/components/LeadModal"
    "@/components/dashboard/LeadTable" = "@/modules/leads/components/LeadTable"
    "@/components/dashboard/LeadTimeline" = "@/modules/leads/components/LeadTimeline"
    "@/components/dashboard/LeadStatusBadge" = "@/modules/leads/components/LeadStatusBadge"
    "@/components/dashboard/LeadFilters" = "@/modules/leads/components/LeadFilters"
    "@/components/dashboard/LeadSearch" = "@/modules/leads/components/LeadSearch"
    "@/components/dashboard/Pagination" = "@/modules/shared/components/Pagination"
}

Get-ChildItem -Path "src" -Recurse -File -Include *.ts,*.tsx | ForEach-Object {

    $path = $_.FullName

    $content = [System.IO.File]::ReadAllText($path)

    $updated = $content

    foreach($pair in $replacements.GetEnumerator()) {
        $updated = $updated.Replace($pair.Key,$pair.Value)
    }

    if($updated -ne $content) {

        [System.IO.File]::WriteAllText(
            $path,
            $updated,
            [System.Text.UTF8Encoding]::new($false)
        )

        Write-Host "Updated $path"
    }
}

Write-Host ""
Write-Host "Finished."