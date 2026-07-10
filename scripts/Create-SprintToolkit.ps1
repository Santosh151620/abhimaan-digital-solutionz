# ============================================================
# Create-SprintToolkit.ps1
# PowerShell 5.1
# Creates the complete Sprint Toolkit folder structure
# ============================================================

$ProjectRoot = Get-Location

$Toolkit = Join-Path $ProjectRoot "scripts"

$Files = @(
"Export-SprintDashboard.ps1",
"Export-SprintCompanies.ps1",
"Export-SprintContacts.ps1",
"Export-SprintLeads.ps1",
"Export-SprintOpportunities.ps1",
"Export-SprintActivities.ps1",
"Export-SprintTasks.ps1",
"Export-SprintMarketing.ps1",
"Export-SprintExecutive.ps1",
"Export-Sprint.ps1",
"Import-ChatGPTDelivery.ps1",
"Backup-BeforeImport.ps1",
"Validate-Delivery.ps1",
"Package-Demo.ps1"
)

foreach($file in $Files){

    $path = Join-Path $Toolkit $file

    if(!(Test-Path $path)){

        New-Item `
            -ItemType File `
            -Path $path `
            -Force | Out-Null

        Write-Host "Created $file"

    }
    else{

        Write-Host "Exists $file"

    }

}

Write-Host ""
Write-Host "Sprint Toolkit Ready."