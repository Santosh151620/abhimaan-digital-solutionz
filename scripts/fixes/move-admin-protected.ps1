$ErrorActionPreference = "Stop"

$Admin = ".\src\app\admin"
$Protected = ".\src\app\admin\(protected)"

Write-Host ""
Write-Host "Creating protected route group..."
Write-Host ""

if (!(Test-Path $Protected)) {
    New-Item -ItemType Directory -Path $Protected | Out-Null
}

# Move layout
if (Test-Path "$Admin\layout.tsx") {
    Move-Item "$Admin\layout.tsx" "$Protected\layout.tsx" -Force
    Write-Host "Moved layout.tsx"
}

# Move page.tsx
if (Test-Path "$Admin\page.tsx") {
    Move-Item "$Admin\page.tsx" "$Protected\page.tsx" -Force
    Write-Host "Moved page.tsx"
}

# Move protected folders
$Folders = @(
    "dashboard",
    "leads",
    "settings"
)

foreach($Folder in $Folders){

    if(Test-Path "$Admin\$Folder"){

        Move-Item `
            "$Admin\$Folder" `
            "$Protected\$Folder" `
            -Force

        Write-Host "Moved $Folder"
    }
}

Write-Host ""
Write-Host "Done."