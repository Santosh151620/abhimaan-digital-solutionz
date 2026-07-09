$ErrorActionPreference = "Stop"

function Ensure-Folder {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        New-Item -ItemType Directory -Path $Path | Out-Null
    }
}

function Write-TextFile {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,

        [Parameter(Mandatory = $true)]
        [string[]]$Content
    )

    $parent = Split-Path -Parent $Path

    Ensure-Folder $parent

    Set-Content `
        -LiteralPath $Path `
        -Value $Content `
        -Encoding UTF8
}

function Append-IfMissing {
    param(
        [string]$Path,
        [string]$Text
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        Set-Content -LiteralPath $Path -Value @($Text) -Encoding UTF8
        return
    }

    $content = Get-Content -LiteralPath $Path

    if ($content -notcontains $Text) {
        Add-Content -LiteralPath $Path -Value $Text
    }
}

function Replace-Token {
    param(
        [string]$Path,
        [string]$Search,
        [string]$Replace
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        return
    }

    $content = Get-Content -LiteralPath $Path

    $updated = $content -replace [regex]::Escape($Search), $Replace

    Set-Content `
        -LiteralPath $Path `
        -Value $updated `
        -Encoding UTF8
}