$files = @(
"src/modules/leads/components/LeadModal.tsx",
"src/modules/leads/components/LeadTable.tsx"
)

foreach($file in $files){

$content = Get-Content $file -Raw

$content = $content -replace `
'import type \{ Lead, LeadStatus \} from "@/types/lead";',
'import type { LeadEntity, LeadStatus } from "../types/lead.entity";'

$content = $content -replace `
'import type \{ Lead \} from "@/types/lead";',
'import type { LeadEntity, LeadStatus } from "../types/lead.entity";'

$content = $content -replace `
'import type \{ LeadStatus \} from "@/types/lead";',
''

$content = $content -replace '\bLead\[\]', 'LeadEntity[]'

$content = $content -replace '\(lead: Lead\)', '(lead: LeadEntity)'

$content = $content -replace 'lead: Lead \| null', 'lead: LeadEntity | null'

$content = $content -replace '\bLead\b', 'LeadEntity'

Set-Content $file $content -Encoding utf8

Write-Host "Updated $file"
}
