cd C:\Projects\MDSWEBSITE\abhimaan-digital-solutionz

$files = Get-ChildItem `
".\src\modules\dashboard\components" `
-Filter "*.tsx"

foreach($file in $files){

$content = Get-Content -LiteralPath $file.FullName -Raw

$content = $content.Replace(
"rounded-2xl",
"rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
)

Set-Content `
-LiteralPath $file.FullName `
-Value $content `
-Encoding UTF8
}

Write-Host "Dashboard motion classes applied."