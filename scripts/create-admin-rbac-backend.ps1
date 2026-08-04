$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "============================================="
Write-Host " ADS RBAC BACKEND FILE CREATOR"
Write-Host "============================================="
Write-Host ""

$files=@(

"src\repositories\admin\RolePermissionRepository.ts",
"src\services\admin\RolePermissionService.ts",

"src\app\admin\(protected)\role-permissions\actions.ts",
"src\app\admin\(protected)\user-roles\actions.ts"

)

foreach($file in $files){

    $dir=Split-Path $file

    if(!(Test-Path $dir)){
        New-Item $dir -ItemType Directory -Force | Out-Null
    }

    if(!(Test-Path $file)){
        New-Item $file -ItemType File | Out-Null
        Write-Host "Created $file"
    }
    else{
        Write-Host "Exists  $file"
    }

}

Write-Host ""
Write-Host "============================================="
Write-Host " RBAC BACKEND FILE CREATION COMPLETE"
Write-Host "============================================="