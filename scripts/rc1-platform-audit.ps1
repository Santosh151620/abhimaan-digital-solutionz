$ErrorActionPreference = "SilentlyContinue"

$root = Get-Location
$out = Join-Path $root "RC1-AUDIT"

if(Test-Path $out){
    Remove-Item $out -Recurse -Force
}

New-Item $out -ItemType Directory | Out-Null

function Export-Tree($path,$name){

    if(Test-Path $path){

        Get-ChildItem $path -Recurse |
        Select-Object FullName |
        Out-File "$out\$name.txt"

    }

}

Export-Tree "src" "01-src-tree"
Export-Tree "src\app" "02-app"
Export-Tree "src\components" "03-components"
Export-Tree "src\repositories" "04-repositories"
Export-Tree "src\services" "05-services"
Export-Tree "src\types" "06-types"
Export-Tree "src\lib" "07-lib"
Export-Tree "src\hooks" "08-hooks"
Export-Tree "src\utils" "09-utils"

Get-ChildItem src -Recurse -Include *.ts,*.tsx |
Select-String "TODO|FIXME|NotificationService|TenantContextManager|console\.log|any\b" |
Out-File "$out\10-code-review.txt"

Get-ChildItem src -Recurse -Include *.ts,*.tsx |
Select FullName |
Out-File "$out\11-all-files.txt"

npx tsc --noEmit *> "$out\12-tsc.txt"

npm run lint *> "$out\13-lint.txt"

npm run build *> "$out\14-build.txt"

Compress-Archive `
Path "$out\*" `
DestinationPath "RC1-AUDIT.zip" `
-Force

Remove-Item $out -Recurse -Force

Remove-Item $MyInvocation.MyCommand.Path -Force