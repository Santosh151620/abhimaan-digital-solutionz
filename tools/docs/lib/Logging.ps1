<#
.SYNOPSIS
    Common logging functions for the Documentation Engine.

.DESCRIPTION
    Provides standardized console logging with timestamps and severity
    levels for all Documentation Engine scripts.

.NOTES
    Project : Abhimaan Digital Solutionz
    Module  : Internal Developer Tooling (IDT)
    Version : 1.0.0
#>

Set-StrictMode -Version Latest

function Write-Log {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Message,

        [ValidateSet('INFO', 'SUCCESS', 'WARNING', 'ERROR')]
        [string]$Level = 'INFO'
    )

    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'

    switch ($Level) {
        'INFO' {
            Write-Host "[$timestamp] [INFO]    $Message" -ForegroundColor Cyan
        }

        'SUCCESS' {
            Write-Host "[$timestamp] [SUCCESS] $Message" -ForegroundColor Green
        }

        'WARNING' {
            Write-Host "[$timestamp] [WARNING] $Message" -ForegroundColor Yellow
        }

        'ERROR' {
            Write-Host "[$timestamp] [ERROR]   $Message" -ForegroundColor Red
        }
    }
}