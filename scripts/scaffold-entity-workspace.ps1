$files = @(
"src/components/entities/EntityWorkspace.tsx",
"src/components/entities/EntityHeader.tsx",
"src/components/entities/EntityTabs.tsx",
"src/components/entities/EntityOverview.tsx",
"src/components/entities/EntityTimeline.tsx",
"src/components/entities/EntityActivityFeed.tsx",
"src/components/entities/EntityNotes.tsx",
"src/components/entities/EntityTasks.tsx",
"src/components/entities/EntityAttachments.tsx",
"src/components/entities/EntityNotifications.tsx"
)

foreach($file in $files){
    if(!(Test-Path $file)){
        New-Item -ItemType File -Force -Path $file | Out-Null
    }
}

Write-Host "Entity Workspace scaffold ready."