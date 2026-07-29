# ============================================================================
# ADS APPLICATION DEPENDENCY ALIGNMENT AUDIT
# PowerShell 5.1 Compatible
# READ ONLY
# ============================================================================

Write-Host ""
Write-Host "===================================================="
Write-Host " ADS APPLICATION DEPENDENCY ALIGNMENT AUDIT"
Write-Host "===================================================="
Write-Host ""


$paths = @(
    ".\src\services",
    ".\src\repositories",
    ".\src\types",
    ".\src\actions",
    ".\src\app",
    ".\src\components"
)


$searchPatterns = @(
    "Activity",
    "Activities",
    "Notification",
    "Notifications",
    "Attachment",
    "Attachments",
    "Task",
    "Tasks",
    "Lead",
    "Client",
    "Project",
    "Entity"
)


$output = ".\application-dependency-audit.txt"


if(Test-Path $output)
{
    Remove-Item $output
}


"====================================================" | Out-File $output
" ADS APPLICATION DEPENDENCY REPORT" | Out-File $output -Append
"====================================================" | Out-File $output -Append
"" | Out-File $output -Append



foreach($path in $paths)
{

    if(Test-Path $path)
    {

        Add-Content $output ""
        Add-Content $output "--------------------------------------------"
        Add-Content $output "PATH: $path"
        Add-Content $output "--------------------------------------------"


        foreach($pattern in $searchPatterns)
        {

            Add-Content $output ""
            Add-Content $output "SEARCH: $pattern"


            Get-ChildItem `
            -Path $path `
            -Recurse `
            -File `
            -Include *.ts,*.tsx |
            Select-String `
            -Pattern $pattern |
            ForEach-Object {

                Add-Content $output (
                    "$($_.Path) | Line $($_.LineNumber) | $($_.Line.Trim())"
                )

            }

        }

    }

}



Write-Host ""
Write-Host "===================================================="
Write-Host " AUDIT COMPLETE"
Write-Host "===================================================="
Write-Host ""

Write-Host "Generated:"
Write-Host $output