$pages = @(
"src/app/crm/companies/[id]/page.tsx",
"src/app/crm/companies/new/page.tsx",
"src/app/crm/companies/[id]/edit/page.tsx",
"src/app/admin/leads/page.tsx"
)

Write-Host ""
Write-Host "=== ENTITY PAGE CHECK ==="

foreach($p in $pages){
    if(Test-Path $p){
        Write-Host "[OK] $p"
    }else{
        Write-Host "[MISSING] $p"
    }
}