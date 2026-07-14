$ErrorActionPreference="Stop"

.\scripts\55-executive-dashboard-audit.ps1

npm run lint
if($LASTEXITCODE -ne 0){ throw "Lint Failed" }

npm run build
if($LASTEXITCODE -ne 0){ throw "Build Failed" }

git status