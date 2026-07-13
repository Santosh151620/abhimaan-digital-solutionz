$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "======================================"
Write-Host "Sprint 7 - Payments Audit"
Write-Host "======================================"

$files=@(
".\src\modules\payments",
".\src\modules\payments\repositories\payment.repository.ts",
".\src\modules\payments\services\payments.ts",
".\src\modules\payments\components\PaymentTable.tsx",
".\src\modules\payments\components\PaymentModal.tsx",
".\src\modules\payments\api\payments.api.ts",
".\src\services\payments.ts"
)

foreach($file in $files)
{
    if(Test-Path $file)
    {
        Write-Host "[OK] $file"
    }
    else
    {
        Write-Host "[MISSING] $file"
    }
}

Write-Host ""
Write-Host "Searching payment implementation..."

Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "PaymentTable|PaymentModal|usePayments|payments.ts|payment.repository|Outstanding|Invoice" |
Select Path,LineNumber |
Sort Path