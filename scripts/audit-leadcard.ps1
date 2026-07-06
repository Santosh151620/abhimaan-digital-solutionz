$files = Get-ChildItem -Path src -Recurse -Include *.ts,*.tsx

Write-Host "`n=== LeadCard imports ===`n"

$files | Select-String -Pattern "LeadCard"

Write-Host "`n=== Legacy Lead type usage ===`n"

$files | Select-String -Pattern `
"import.*Lead|type Lead|interface Lead|LeadDTO|LegacyLead|lead\.mapper|toLead\("

Write-Host "`n=== LeadCard prop usage ===`n"

$files | Select-String -Pattern `
"<LeadCard|LeadCard\("

