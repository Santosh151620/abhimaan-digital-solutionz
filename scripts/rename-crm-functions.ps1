$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " CRM FACTORY FUNCTION RENAMER"
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$map = [ordered]@{

    'function\s+Assert-CrmModule\b'      = 'function Assert-CrmModule'
    '\bTest-FactoryModule\b'               = 'Assert-CrmModule'

    'function\s+New-CrmModule\b'              = 'function New-CrmModule'
    '\bNew-Module\b'                       = 'New-CrmModule'

    'function\s+Update-CrmModule\b'           = 'function Update-CrmModule'
    '\bUpdate-Module\b'                    = 'Update-CrmModule'

    'function\s+Remove-CrmModule\b'           = 'function Remove-CrmModule'
    '\bRemove-Module\b'                    = 'Remove-CrmModule'

    'function\s+Show-CrmModules\b' = 'function Show-CrmModules'
    '\bGet-RegisteredModulesList\b'          = 'Show-CrmModules'

}

$files = Get-ChildItem `
            -Path $root `
            -Filter *.ps1 `
            -Recurse

foreach($file in $files){

   try {

    $text = Get-Content `
                -LiteralPath $file.FullName `
                -Raw `
                -ErrorAction Stop

}
catch {

    Write-Host "[FAILED ] $($file.Name)" -ForegroundColor Red
    continue

}

if ([string]::IsNullOrWhiteSpace($text)) {

    Write-Host "[EMPTY  ] $($file.Name)" -ForegroundColor Yellow
    continue

}

$original = $text

foreach ($pair in $map.GetEnumerator()) {

    $text = [regex]::Replace(
        $text,
        $pair.Key,
        $pair.Value
    )

}

    if($text -ne $original){

        Set-Content `
            -LiteralPath $file.FullName `
            -Encoding UTF8 `
            -Value $text

        Write-Host "[UPDATED] $($file.Name)" -ForegroundColor Green

    }
    else{

        Write-Host "[SKIPPED] $($file.Name)" -ForegroundColor DarkGray

    }

}

Write-Host ""
Write-Host "Rename completed." -ForegroundColor Green
Write-Host ""
