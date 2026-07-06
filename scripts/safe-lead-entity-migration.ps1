$files = @(
"src/modules/leads/components/LeadTable.tsx",
"src/modules/leads/components/LeadModal.tsx"
)

foreach($file in $files){

    Copy-Item $file "$file.backup" -Force

    Write-Host "Backup created: $file.backup"
}


# LeadTable cleanup

$file = "src/modules/leads/components/LeadTable.tsx"

$content = Get-Content $file -Raw


$content = $content.Replace(
'import type { LeadEntity, LeadStatus } from "../types/lead.entity";',
'import type { LeadEntity, LeadStatus } from "../types/lead.entity";'
)


$content = $content.Replace(
'import type { Lead } from "@/types/lead";',
''
)


$content = $content.Replace(
'leads: Lead[];',
'leads: LeadEntity[];'
)


$content = $content.Replace(
'(lead: Lead)',
'(lead: LeadEntity)'
)


Set-Content $file $content -Encoding utf8



# LeadModal cleanup

$file = "src/modules/leads/components/LeadModal.tsx"

$content = Get-Content $file -Raw


$content = $content.Replace(
'import type { LeadEntity, LeadEntity, LeadStatus } from "../types/lead.entity";',
'import type { LeadEntity, LeadStatus } from "../types/lead.entity";'
)


$content = $content.Replace(
'lead.full_name',
'lead.name'
)


Set-Content $file $content -Encoding utf8


Write-Host "Migration patch complete"

