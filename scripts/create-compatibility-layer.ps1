$modules = @(
"Companies",
"Contacts",
"Contracts",
"Assets",
"Invoices",
"Quotations",
"Tickets",
"Pipeline",
"Opportunities"
)

foreach($m in $modules){

New-Item -ItemType Directory -Force src/components/crm/$($m.ToLower()) | Out-Null
New-Item -ItemType Directory -Force src/services/crm | Out-Null
New-Item -ItemType Directory -Force src/repositories/crm | Out-Null
New-Item -ItemType Directory -Force src/hooks/crm | Out-Null
New-Item -ItemType Directory -Force src/types/crm | Out-Null

Set-Content "src/components/crm/$($m.ToLower())/index.ts" "export * from '@/modules/crm/$($m.ToLower())/components';"

Set-Content "src/services/crm/$m`Service.ts" "export * from '@/modules/crm/$($m.ToLower())/services';"

Set-Content "src/repositories/crm/$m`Repository.ts" "export * from '@/modules/crm/$($m.ToLower())/repository';"

Set-Content "src/hooks/crm/use$m.ts" "export * from '@/modules/crm/$($m.ToLower())/hooks';"

Set-Content "src/types/crm/$m.ts" "export * from '@/modules/crm/$($m.ToLower())/types';"

}