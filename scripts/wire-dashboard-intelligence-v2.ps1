$ErrorActionPreference="Stop"

$page="src\app\[locale]\dashboard\page.tsx"

$content=[System.IO.File]::ReadAllText((Resolve-Path -LiteralPath $page))

if($content -notmatch '<QuickActionsPanel\s*/>'){

$find='<section className="grid gap-6 xl:grid-cols-3">'

$insert=@'
      <QuickActionsPanel />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentLeadsPanel />
        <TeamPerformancePanel />
      </div>

<section className="grid gap-6 xl:grid-cols-3">
'@

$content=$content.Replace($find,$insert)

[System.IO.File]::WriteAllText((Resolve-Path -LiteralPath $page),$content)

}

Write-Host "Dashboard Intelligence V2 rewired."