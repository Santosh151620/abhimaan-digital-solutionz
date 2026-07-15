$ErrorActionPreference="SilentlyContinue"

Write-Host ""
Write-Host "==============================="
Write-Host " Fixing Quotations Module"
Write-Host "==============================="
Write-Host ""

# -------------------------------------------------------
# Rename files
# -------------------------------------------------------

$renameMap=@(
@("src\types\crm\Quotation.ts","src\types\crm\Quotations.ts"),
@("src\services\crm\QuotationService.ts","src\services\crm\QuotationsService.ts"),
@("src\repositories\crm\QuotationsRepository.ts","src\repositories\crm\QuotationsRepository.ts"),
@("src\components\crm\quotations\QuotationsForm.tsx","src\components\crm\quotations\QuotationsForm.tsx"),
@("src\components\crm\quotations\QuotationsTable.tsx","src\components\crm\quotations\QuotationsTable.tsx"),
@("src\components\crm\quotations\QuotationsSummary.tsx","src\components\crm\quotations\QuotationsSummary.tsx")
)

foreach($r in $renameMap){

    if(Test-Path $r[0]){
        Rename-Item $r[0] (Split-Path $r[1] -Leaf) -Force
        Write-Host "Renamed $($r[0])"
    }

}

# -------------------------------------------------------
# Replace imports everywhere
# -------------------------------------------------------

$files=Get-ChildItem src -Recurse -Include *.ts,*.tsx

foreach($f in $files){

    $c=Get-Content $f.FullName -Raw

    $c=$c.Replace("QuotationsRepository","QuotationsRepository")
    $c=$c.Replace("QuotationsRepositoryInstance","QuotationsRepositoryInstance")

    $c=$c.Replace("QuotationService","QuotationsService")
    $c=$c.Replace("QuotationServiceInstance","QuotationsServiceInstance")

    $c=$c.Replace("@/types/crm/Quotations","@/types/crm/Quotationss")

    $c=$c.Replace("./QuotationsForm","./QuotationsForm")
    $c=$c.Replace("./QuotationsTable","./QuotationsTable")
    $c=$c.Replace("./QuotationsSummary","./QuotationsSummary")

    $c=$c.Replace("QuotationsForm","QuotationsForm")
    $c=$c.Replace("QuotationsTable","QuotationsTable")
    $c=$c.Replace("QuotationsSummary","QuotationsSummary")

    Set-Content $f.FullName $c

}

Write-Host ""
Write-Host "Completed."