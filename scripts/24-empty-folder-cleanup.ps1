$ErrorActionPreference="Stop"

Get-ChildItem .\src -Directory -Recurse |
Sort-Object FullName -Descending |
Where-Object {
($_.GetFiles().Count + $_.GetDirectories().Count) -eq 0
} |
ForEach-Object{
Write-Host "Removing $($_.FullName)"
Remove-Item $_.FullName -Force
}