$root="src"

$files=@(
"app/admin/(protected)/users/UserActions.ts",
"components/admin/users/UserDialog.tsx",
"components/admin/users/UserRoleAssignment.tsx",

"app/admin/(protected)/roles/actions.ts",
"components/admin/roles/RoleDialog.tsx",

"app/admin/(protected)/permissions/actions.ts",

"repositories/admin/UserRoleRepository.ts",
"services/admin/UserRoleService.ts",
"types/admin/UserRole.ts"
)


foreach($file in $files){

    $path="$root/$file"

    $dir=Split-Path $path

    if(!(Test-Path $dir)){
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }


    if(!(Test-Path $path)){

        New-Item $path -ItemType File -Force | Out-Null

        Write-Host "Created $path"

    }
    else{

        Write-Host "Exists $path"

    }

}


Write-Host ""
Write-Host "ADMIN CRUD FILE CREATION COMPLETE"