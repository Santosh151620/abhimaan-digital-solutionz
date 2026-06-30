@{
    Metadata = @{
        ProjectName          = 'Abhimaan Digital Solutionz'
        ProjectCode          = 'ADS'
        DocumentationVersion = '1.0.0'
        ManifestVersion      = '1.0.0'
        SchemaVersion        = '1.0'
        Author               = 'Abhimaan Digital Solutionz'
    }

    Paths = @{
        DocsRoot     = 'docs'
        TemplateRoot = 'tools/docs/templates'
        OutputRoot   = 'docs'
    }

    Generator = @{
        FileExtension       = '.md'
        OverwriteExisting   = $false
        GenerateMissingOnly = $true
        PlaceholderPrefix   = '{{'
        PlaceholderSuffix   = '}}'
    }

    Categories = @(
        'Governance'
        'Business'
        'Product'
        'Architecture'
        'Development'
        'QA'
        'Operations'
        'Security'
        'Marketing'
        'Training'
        'Releases'
    )

    Templates = @{
        Governance   = 'governance.md'
        Business     = 'business.md'
        Product      = 'product.md'
        Architecture = 'architecture.md'
        Development  = 'development.md'
        QA           = 'qa.md'
        Operations   = 'operations.md'
        Security     = 'security.md'
        Marketing    = 'marketing.md'
        Training     = 'training.md'
        Releases     = 'release.md'
    }
}