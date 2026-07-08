$layout = "src\app\[locale]\layout.tsx"

$text = [System.IO.File]::ReadAllText((Resolve-Path -LiteralPath $layout))

$import = 'import { CommandPaletteProvider } from "@/components/command-palette";'

if ($text -notmatch 'CommandPaletteProvider') {

    $text = $text.Replace(
'import WhatsAppButton from "@/components/layout/WhatsAppButton";',
'import WhatsAppButton from "@/components/layout/WhatsAppButton";
' + $import
    )

}

if ($text -notmatch '<CommandPaletteProvider>') {

    $text = $text.Replace(
'<Header />',
'<CommandPaletteProvider>

      <Header />'
    )

    $text = $text.Replace(
'<WhatsAppButton />',
'<WhatsAppButton />

    </CommandPaletteProvider>'
    )

}

[System.IO.File]::WriteAllText(
    (Resolve-Path -LiteralPath $layout),
    $text,
    [System.Text.UTF8Encoding]::new($false)
)

Write-Host "Command Palette wired successfully."