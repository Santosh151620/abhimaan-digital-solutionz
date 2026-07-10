# =====================================================================
# Export-SprintCompanies.ps1
# =====================================================================

$ProjectRoot = Get-Location
$OutputRoot = Join-Path $ProjectRoot "SprintExports"
$ExportRoot = Join-Path $OutputRoot "Companies-P1"

if(Test-Path $ExportRoot){
    Remove-Item $ExportRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $ExportRoot | Out-Null

$Folders=@(

"src\components\crm\companies",
"src\app\crm\companies",
"src\app\api\crm\companies"

)

foreach($folder in $Folders){

    $Source=Join-Path $ProjectRoot $folder

    if(Test-Path $Source){

        $Destination=Join-Path $ExportRoot (Split-Path $folder)

        Copy-Item $Source $Destination -Recurse -Force

    }

}

$Files=@(

"src\repositories\crm\CompaniesRepository.ts",
"src\services\crm\CompaniesService.ts",
"src\hooks\crm\useCompanies.ts",
"src\types\crm\Companies.ts",
"src\lib\validation\CompaniesSchema.ts"

)

foreach($file in $Files){

    $Source=Join-Path $ProjectRoot $file

    if(Test-Path $Source){

        $Destination=Join-Path $ExportRoot $file

        $Folder=Split-Path $Destination

        if(!(Test-Path $Folder)){
            New-Item $Folder -ItemType Directory -Force | Out-Null
        }

        Copy-Item $Source $Destination -Force

    }

}

Write-Host ""
Write-Host "Companies export complete."