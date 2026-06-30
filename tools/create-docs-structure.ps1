$folders = @(
"docs\00-Governance",
"docs\01-Business",
"docs\01-Business\Vision",
"docs\01-Business\Executive Summary",
"docs\01-Business\Business Model",
"docs\01-Business\Value Proposition",
"docs\01-Business\Market Analysis",
"docs\01-Business\Pricing Strategy",
"docs\01-Business\Sales Playbook",
"docs\01-Business\Investor Pitch",
"docs\01-Business\Product Roadmap",

"docs\02-Product",
"docs\02-Product\PRDs",
"docs\02-Product\Features",
"docs\02-Product\User Stories",
"docs\02-Product\Personas",
"docs\02-Product\Wireflows",
"docs\02-Product\Functional Specs",
"docs\02-Product\Release Planning",

"docs\03-Architecture",
"docs\03-Architecture\System Architecture",
"docs\03-Architecture\Folder Structure",
"docs\03-Architecture\ADRs",
"docs\03-Architecture\Security",
"docs\03-Architecture\Performance",
"docs\03-Architecture\Database Design",
"docs\03-Architecture\API Design",

"docs\04-Development",
"docs\04-Development\Coding Standards",
"docs\04-Development\Component Guidelines",
"docs\04-Development\Git Workflow",
"docs\04-Development\CI-CD",
"docs\04-Development\Environment Setup",

"docs\05-QA",
"docs\05-QA\Test Strategy",
"docs\05-QA\Test Cases",
"docs\05-QA\Regression",
"docs\05-QA\UAT",
"docs\05-QA\Bug Templates",

"docs\06-Operations",
"docs\06-Operations\Deployment",
"docs\06-Operations\Monitoring",
"docs\06-Operations\Incident Response",
"docs\06-Operations\Backup",
"docs\06-Operations\Disaster Recovery",

"docs\07-Security",
"docs\07-Security\Authentication",
"docs\07-Security\Authorization",
"docs\07-Security\OWASP",
"docs\07-Security\Compliance",
"docs\07-Security\Vulnerability Reports",

"docs\08-Marketing",
"docs\08-Marketing\Brand Guidelines",
"docs\08-Marketing\Campaigns",
"docs\08-Marketing\Demo Scripts",
"docs\08-Marketing\Advertisement Scripts",
"docs\08-Marketing\Social Content",

"docs\09-Training",
"docs\09-Training\User Manuals",
"docs\09-Training\Admin Manuals",
"docs\09-Training\FAQs",
"docs\09-Training\Demo Guide",
"docs\09-Training\Workshop Material",

"docs\10-Releases",

"docs\assets",
"docs\assets\logos",
"docs\assets\screenshots",
"docs\assets\architecture",
"docs\assets\videos",

"docs\templates"
)

$folders | ForEach-Object {
    New-Item -ItemType Directory -Force -Path $_ | Out-Null
}

Write-Host "✅ Documentation folder structure created successfully."