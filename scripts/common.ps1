Set-StrictMode -Version Latest

$ErrorActionPreference = "Stop"

$Script:FactoryVersion = "1.0.0"

$Script:ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

$Script:ProjectRoot = Resolve-Path (Join-Path $Script:ScriptRoot "..")

function Write-Section {

    param([string]$Text)

    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host $Text -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host ""

}

function Write-Step {

    param([string]$Text)

    Write-Host "[STEP] $Text" -ForegroundColor Cyan

}

function Write-Success {

    param([string]$Text)

    Write-Host "[ OK ] $Text" -ForegroundColor Green

}

function Write-WarningMessage {

    param([string]$Text)

    Write-Host "[WARN] $Text" -ForegroundColor Yellow

}

function Stop-Factory {

    param([string]$Text)

    Write-Host "[FAIL] $Text" -ForegroundColor Red

    exit 1

}

function Ensure-Folder {

    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {

        New-Item `
            -ItemType Directory `
            -Path $Path | Out-Null

        Write-Success "Created Folder : $Path"

    }

}

function Write-TextFile {

    param(

        [string]$Path,

        [string[]]$Content,

        [switch]$Force

    )

    $parent = Split-Path -Parent $Path

    Ensure-Folder $parent

    if ((Test-Path -LiteralPath $Path) -and (-not $Force)) {

        Write-WarningMessage ("Skipped Existing : " + $Path)

        return

    }

    Set-Content `
        -LiteralPath $Path `
        -Encoding UTF8 `
        -Value $Content

    if ($Force) {

        Write-Success ("Updated File : " + $Path)

    }
    else {

        Write-Success ("Created File : " + $Path)

    }

}

function Append-Line {

    param(

        [string]$Path,

        [string]$Line

    )

    if (-not (Test-Path -LiteralPath $Path)) {

        Set-Content `
            -LiteralPath $Path `
            -Encoding UTF8 `
            -Value @($Line)

        return

    }

    Add-Content `
        -LiteralPath $Path `
        -Value $Line

}

function Invoke-Lint {

    Write-Section "Running ESLint"

    npm run lint

    if ($LASTEXITCODE -ne 0) {

        Stop-Factory "Lint Failed."

    }

    Write-Success "Lint Passed"

}

function Invoke-Build {

    Write-Section "Running Next.js Build"

    npm run build

    if ($LASTEXITCODE -ne 0) {

        Stop-Factory "Build Failed."

    }

    Write-Success "Build Passed"

}