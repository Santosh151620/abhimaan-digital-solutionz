$root = Get-Location


Write-Host ""
Write-Host "===================================="
Write-Host " ADS ADMIN USERS CRUD FILE CREATOR"
Write-Host "===================================="
Write-Host ""


$files = @(

    "src/components/admin/users/UsersClient.tsx",

    "src/app/admin/(protected)/users/actions.ts"

)


foreach ($file in $files) {


    $fullPath = Join-Path $root $file


    $directory =
        Split-Path $fullPath



    if (!(Test-Path $directory)) {

        New-Item `
            -ItemType Directory `
            -Path $directory `
            -Force | Out-Null

    }



    if (!(Test-Path $fullPath)) {


        New-Item `
            -ItemType File `
            -Path $fullPath `
            -Force | Out-Null


        Write-Host "Created:"
        Write-Host $file


    }
    else {


        Write-Host "Exists:"
        Write-Host $file


    }

}



Write-Host ""

Write-Host "===================================="
Write-Host " FILE CREATION COMPLETE"
Write-Host "===================================="
