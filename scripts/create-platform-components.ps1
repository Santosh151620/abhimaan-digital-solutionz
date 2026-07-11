$folders = @(
"src/components/entities",
"src/components/platform",
"src/components/dashboard"
)

foreach($folder in $folders){
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
}

$files=@(

"src/components/entities/EntityHeader.tsx",
"src/components/entities/EntityActionBar.tsx",
"src/components/entities/EntityTabs.tsx",
"src/components/entities/EntityKPIStrip.tsx",
"src/components/entities/EntityStatusBadge.tsx",
"src/components/entities/EntityTimeline.tsx",
"src/components/entities/EntityAudit.tsx",
"src/components/entities/EntityEmptyState.tsx",
"src/components/entities/index.ts",

"src/components/platform/ApprovalBadge.tsx",
"src/components/platform/ApprovalStatus.tsx",
"src/components/platform/PermissionGate.tsx",
"src/components/platform/RestoreBanner.tsx",
"src/components/platform/SoftDeleteBanner.tsx",
"src/components/platform/RetentionBadge.tsx",
"src/components/platform/index.ts",

"src/components/dashboard/DashboardTabs.tsx",
"src/components/dashboard/DashboardSection.tsx",
"src/components/dashboard/DashboardGrid.tsx",
"src/components/dashboard/DashboardSummaryCard.tsx",
"src/components/dashboard/DashboardQuickActions.tsx",
"src/components/dashboard/DashboardWidget.tsx",
"src/components/dashboard/index.ts"
)

foreach($file in $files){

if(!(Test-Path $file)){
New-Item -ItemType File -Path $file | Out-Null
}

}

Write-Host ""
Write-Host "Platform scaffold created."