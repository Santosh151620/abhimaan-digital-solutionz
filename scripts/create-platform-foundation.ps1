$ErrorActionPreference = "Stop"

. "$PSScriptRoot\common.ps1"

$ProjectRoot = Get-ProjectRoot

Write-Section "Abhimaan CRM Platform Foundation V0-1"

# ------------------------------------------------------------------
# Documentation Folders
# ------------------------------------------------------------------

$DocFolders = @(
    "docs",
    "docs\Modules"
)

foreach ($Folder in $DocFolders) {
    Ensure-Folder (Join-Path $ProjectRoot $Folder)
}

# ------------------------------------------------------------------
# Platform Folders
# ------------------------------------------------------------------

$PlatformFolders = @(
    "src\platform",
    "src\platform\core",
    "src\platform\configuration",
    "src\platform\deployment",
    "src\platform\tenant",
    "src\platform\organization",
    "src\platform\subscription",
    "src\platform\licensing",
    "src\platform\features",
    "src\platform\shared",
    "src\platform\services",
    "src\platform\repositories",
    "src\platform\hooks",
    "src\platform\types",
    "src\platform\utils"
)

foreach ($Folder in $PlatformFolders) {

    $FullPath = Join-Path $ProjectRoot $Folder

    Ensure-Folder $FullPath

    Write-Readme `
        -Folder $FullPath `
        -Title (Split-Path $Folder -Leaf)

}

# ------------------------------------------------------------------
# Documentation Files
# ------------------------------------------------------------------

$MarkdownFiles = @(
    "docs\Product Guide.md",
    "docs\Developer Guide.md",
    "docs\Administrator Guide.md",
    "docs\Sales Guide.md",
    "docs\Knowledge Base.md",
    "docs\Architecture.md",
    "docs\Release Notes.md"
)

foreach ($File in $MarkdownFiles) {

    Write-Markdown `
        -Path (Join-Path $ProjectRoot $File) `
        -Title ([System.IO.Path]::GetFileNameWithoutExtension($File))

}

# ------------------------------------------------------------------
# Platform Bootstrap Files
# ------------------------------------------------------------------

$TsFiles = @(
    "src\platform\index.ts",
    "src\platform\core\index.ts",
    "src\platform\configuration\index.ts",
    "src\platform\deployment\index.ts",
    "src\platform\tenant\index.ts",
    "src\platform\organization\index.ts",
    "src\platform\subscription\index.ts",
    "src\platform\licensing\index.ts",
    "src\platform\features\index.ts",
    "src\platform\shared\index.ts",
    "src\platform\services\index.ts",
    "src\platform\repositories\index.ts",
    "src\platform\hooks\index.ts",
    "src\platform\types\index.ts",
    "src\platform\utils\index.ts"
)

foreach ($File in $TsFiles) {

    Write-TypescriptFile `
        -Path (Join-Path $ProjectRoot $File)

}

Write-Host ""
Write-Host "========================================"
Write-Host "Platform Foundation Completed"
Write-Host "========================================"
Write-Host ""