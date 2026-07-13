$ErrorActionPreference = "Stop"

# ---------------------------------------
# Load .env.local
# ---------------------------------------

$envFile = ".\.env.local"

Get-Content $envFile | ForEach-Object {

    if ($_ -match "^\s*#") { return }
    if ($_ -match "^\s*$") { return }

    $parts = $_ -split "=",2

    if ($parts.Count -eq 2) {

        $name = $parts[0].Trim()
        $value = $parts[1].Trim()

        [Environment]::SetEnvironmentVariable($name,$value)
    }
}

$ProjectUrl = $env:NEXT_PUBLIC_SUPABASE_URL.Trim()
$ServiceKey = $env:SUPABASE_SERVICE_ROLE_KEY.Trim()

$Headers = @{
    apikey = $ServiceKey
    Authorization = "Bearer $ServiceKey"
    "Content-Type" = "application/json"
}

$Password = "Admin@123456"

$Users = @(
    "admin@abhimaan.com",
    "admin1@abhimaan.com",
    "manager@abhimaan.com",
    "employee@abhimaan.com",
    "sales@abhimaan.com",
    "hr@abhimaan.com",
    "finance@abhimaan.com"
)

Write-Host ""
Write-Host "Creating development users..."
Write-Host ""

foreach($Email in $Users){

    $Body = @{
        email = $Email
        password = $Password
        email_confirm = $true
    } | ConvertTo-Json

    try {

        $Result = Invoke-RestMethod `
            -Method POST `
            -Uri "$ProjectUrl/auth/v1/admin/users" `
            -Headers $Headers `
            -Body $Body

        Write-Host "[CREATED] $Email"
        Write-Host "ID: $($Result.id)"
        Write-Host ""

    }
    catch {

        Write-Host "[FAILED] $Email"
        Write-Host $_.Exception.Message

        if ($_.ErrorDetails) {
            Write-Host $_.ErrorDetails.Message
        }

        Write-Host ""
    }
}