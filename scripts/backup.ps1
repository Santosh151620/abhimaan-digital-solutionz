$date=Get-Date -Format "yyyyMMdd-HHmm"

New-Item backups\$date -ItemType Directory -Force

Copy-Item src backups\$date -Recurse

Write-Host "Backup Complete."