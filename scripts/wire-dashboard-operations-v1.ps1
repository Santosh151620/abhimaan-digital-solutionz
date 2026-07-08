$page = "src\app\[locale]\dashboard\page.tsx"

$content = Get-Content -LiteralPath $page -Raw

$content = $content.Replace(
'import { NotificationCenter } from "@/modules/dashboard/notifications";',
'import NotificationCenter from "@/modules/dashboard/notifications/NotificationCenter";'
)

$content = $content.Replace(
'import { ActivityFeed } from "@/modules/dashboard/activity";',
'import ActivityFeed from "@/modules/dashboard/activity/ActivityFeed";'
)

$content = $content.Replace(
'import { LiveStatus } from "@/modules/dashboard/live";',
'import LiveStatus from "@/modules/dashboard/live/LiveStatus";'
)

Set-Content -LiteralPath $page -Value $content

Write-Host ""
Write-Host "Dashboard imports fixed."