$targets = @(
"src/modules/leads/components/LeadModal.tsx",
"src/modules/leads/components/LeadTable.tsx"
)

foreach($file in $targets){
    Write-Host "`n===== $file ====="
    Get-Content $file | Select-String -Pattern `
    "interface|type .*Props|LeadStatus|Lead\b|lead:"
}
