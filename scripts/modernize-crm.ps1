$files=Get-ChildItem src/app/crm -Recurse -Filter page.tsx

foreach($file in $files){

$content=Get-Content $file.FullName -Raw

$content=$content -replace 'className="space-y-\d+"',''

$content=$content -replace 'className="rounded-xl','className="'

$content=$content -replace 'className="rounded-2xl','className="'

Set-Content $file.FullName $content

Write-Host "Updated $($file.Name)"

}