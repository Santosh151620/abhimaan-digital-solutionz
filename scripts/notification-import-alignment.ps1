Write-Host ""
Write-Host "===================================================="
Write-Host " NOTIFICATION IMPORT ALIGNMENT"
Write-Host "===================================================="
Write-Host ""


$files = Get-ChildItem .\src -Recurse -Include *.ts,*.tsx


foreach($file in $files)
{
    $content = Get-Content $file.FullName -Raw

    $updated = $content


    # Service import replacement
    $updated = $updated.Replace(
        "@/services/crm/NotificationService",
        "@/services/crm/NotificationsService"
    )


    # Repository import replacement
    $updated = $updated.Replace(
        "@/repositories/crm/NotificationRepository",
        "@/repositories/crm/NotificationsRepository"
    )


    if($updated -ne $content)
    {
        Set-Content `
        -Path $file.FullName `
        -Value $updated `
        -Encoding UTF8

        Write-Host "Updated:"
        Write-Host $file.FullName
    }
}


Write-Host ""
Write-Host "===================================================="
Write-Host " IMPORT ALIGNMENT COMPLETE"
Write-Host "===================================================="