$modules = @(
    "companies",
    "contacts",
    "quotations",
    "contracts",
    "assets",
    "invoices",
    "tickets",
    "pipeline",
    "opportunities"
)

foreach ($m in $modules) {

    $base = "src/modules/crm/$m"

    $folders = @(
        "$base/components",
        "$base/hooks",
        "$base/repository",
        "$base/services",
        "$base/types",
        "$base/validation"
    )

    foreach ($folder in $folders) {
        New-Item -ItemType Directory -Force -Path $folder | Out-Null
    }

    $files = @(
        "$base/index.ts",

        "$base/components/index.ts",
        "$base/hooks/index.ts",
        "$base/repository/index.ts",
        "$base/services/index.ts",
        "$base/types/index.ts",
        "$base/validation/index.ts"
    )

    foreach ($file in $files) {
        if (!(Test-Path $file)) {
            New-Item -ItemType File -Path $file | Out-Null
        }
    }
}