Set-StrictMode -Version Latest

function New-CrudArtifacts {

    param(

        [Parameter(Mandatory = $true)]
        [string]$Module,

        [switch]$Force

    )

    Write-Section "Generating CRUD Layer"

    $ctx = Get-ModuleContext $Module

    Write-Template `
        (Get-ModuleFile $Module "Type") `
        (Get-TypeTemplate) `
        $ctx `
        -Force:$Force

    Write-Success "Type Generated"

    Write-Template `
        (Get-ModuleFile $Module "Repository") `
        (Get-RepositoryTemplate) `
        $ctx `
        -Force:$Force

    Write-Success "Repository Generated"

    Write-Template `
        (Get-ModuleFile $Module "Service") `
        (Get-ServiceTemplate) `
        $ctx `
        -Force:$Force

    Write-Success "Service Generated"

    Write-Template `
        (Get-ModuleFile $Module "Hook") `
        (Get-HookTemplate) `
        $ctx `
        -Force:$Force

    Write-Success "Hook Generated"

    Write-Template `
        (Get-ModuleFile $Module "Validation") `
        (Get-ValidationTemplate) `
        $ctx `
        -Force:$Force

    Write-Success "Validation Generated"

    Write-Success "CRUD Layer Complete"

}

function Get-TypeTemplate {

@(
"export interface {{Module}} {",
"    id: string;",
"    name: string;",
"    createdAt: string;",
"    updatedAt: string;",
"}"
)

}

function Get-RepositoryTemplate {

@(
"export class {{Module}}Repository {",
"",
"    async list() {",
"        return [];",
"    }",
"",
"    async findById(id: string) {",
"        return null;",
"    }",
"",
"    async create(data: unknown) {",
"        return data;",
"    }",
"",
"    async update(id: string, data: unknown) {",
"        return data;",
"    }",
"",
"    async delete(id: string) {",
"        return true;",
"    }",
"",
"}",
"",
"export const {{Module}}RepositoryInstance = new {{Module}}Repository();"
)

}

function Get-ServiceTemplate {

@(
"import { {{Module}}RepositoryInstance } from '@/repositories/crm/{{Module}}Repository';",
"",
"export class {{Module}}Service {",
"",
"    async list() {",
"        return {{Module}}RepositoryInstance.list();",
"    }",
"",
"    async details(id: string) {",
"        return {{Module}}RepositoryInstance.findById(id);",
"    }",
"",
"    async create(data: unknown) {",
"        return {{Module}}RepositoryInstance.create(data);",
"    }",
"",
"    async update(id: string, data: unknown) {",
"        return {{Module}}RepositoryInstance.update(id, data);",
"    }",
"",
"    async delete(id: string) {",
"        return {{Module}}RepositoryInstance.delete(id);",
"    }",
"",
"}",
"",
"export const {{Module}}ServiceInstance = new {{Module}}Service();"
)

}

function Get-HookTemplate {

@(
"export function use{{Module}}() {",
"",
"    return {};",
"",
"}"
)

}

function Get-ValidationTemplate {

@(
"export const {{Module}}Schema = {};")
}