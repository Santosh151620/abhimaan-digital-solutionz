$ErrorActionPreference="Stop"

$page="src\app\[locale]\dashboard\page.tsx"

$content=Get-Content -LiteralPath $page -Raw

# Remove old AI section if present
$content=[regex]::Replace(
    $content,
    '(?s)<section className="grid gap-6 xl:grid-cols-3">\s*<AIScorePanel\s*/>\s*<AISummaryPanel\s*/>\s*<RiskAlertsPanel\s*/>\s*</section>',
    ''
)

# Insert immediately after AI Recommendations panel
$anchor='<AIRecommendationsPanel />'

if($content.Contains($anchor)){

    $content=$content.Replace(
        $anchor,
@'
<AIRecommendationsPanel />

<section className="grid gap-6 xl:grid-cols-3">
  <AIScorePanel />
  <AISummaryPanel />
  <RiskAlertsPanel />
</section>
'@
    )

}

Set-Content -LiteralPath $page -Value $content

Write-Host "Dashboard AI V4 rewired."