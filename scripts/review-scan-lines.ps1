$root = "C:\Projects\MDSWEBSITE\abhimaan-digital-solutionz"

$files = @(
"src\lib\workflow\crmExecutionService.ts",
"src\lib\workflow\workflowRepository.ts",
"src\modules\leads\components\LeadTimeline.tsx",
"src\modules\projects\components\ProjectForm.tsx",
"src\modules\projects\components\ProjectModal.tsx",
"src\modules\projects\components\ProjectTabs.tsx",
"src\modules\payments\components\PaymentModal.tsx",
"src\services\crm\lead-intelligence.ts"
)

$patterns = @(
"TODO",
"FIXME",
"placeholder",
"coming soon",
"mock",
"dummy",
"return []",
"return null"
)

foreach ($file in $files) {

    $path = Join-Path $root $file

    Write-Host ""
    Write-Host "=============================="
    Write-Host $file
    Write-Host "=============================="

    if (Test-Path $path) {

        Select-String `
            -Path $path `
            -Pattern $patterns `
            -SimpleMatch |
            Select-Object LineNumber,Line |
            Format-Table -AutoSize

    }
    else {
        Write-Host "MISSING"
    }
}

Write-Host ""
Write-Host "=== Review Complete ==="