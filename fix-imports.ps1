Write-Host ""
Write-Host "==============================="
Write-Host " Standardizing Quotations Imports"
Write-Host "==============================="
Write-Host ""

Get-ChildItem src -Recurse -Include *.ts,*.tsx | ForEach-Object {

    (Get-Content $_.FullName) `
    -replace '@/types/crm/Quotations','@/types/crm/Quotationss' `
    -replace '@/services/crm/QuotationService','@/services/crm/QuotationsService' `
    -replace '@/repositories/crm/QuotationsRepository','@/repositories/crm/QuotationsRepository' `
    -replace 'QuotationServiceInstance','QuotationsServiceInstance' `
    -replace 'QuotationsRepositoryInstance','QuotationsRepositoryInstance' `
    -replace './QuotationsForm','./QuotationsForm' `
    -replace './QuotationsTable','./QuotationsTable' `
    -replace './QuotationsSummary','./QuotationsSummary' `
    -replace '@/components/crm/quotations/QuotationsForm','@/components/crm/quotations/QuotationsForm' `
    -replace '@/components/crm/quotations/QuotationsTable','@/components/crm/quotations/QuotationsTable' `
    -replace '@/components/crm/quotations/QuotationsSummary','@/components/crm/quotations/QuotationsSummary' |
    Set-Content $_.FullName
}

Write-Host ""
Write-Host "Completed."