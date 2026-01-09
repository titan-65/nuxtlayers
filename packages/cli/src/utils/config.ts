import fs from 'fs-extra'
import path from 'path'

type PackageManager = 'pnpm' | 'yarn' | 'npm'

const CONFIG_FILES = ['nuxt.config.ts', 'nuxt.config.js']

export async function detectPackageManager(): Promise<PackageManager> {
    const cwd = process.cwd()

    if (await fs.pathExists(path.join(cwd, 'pnpm-lock.yaml'))) {
        return 'pnpm'
    }
    if (await fs.pathExists(path.join(cwd, 'yarn.lock'))) {
        return 'yarn'
    }
    return 'npm'
}

export async function findNuxtConfig(): Promise<string | null> {
    for (const configFile of CONFIG_FILES) {
        const configPath = path.join(process.cwd(), configFile)
        if (await fs.pathExists(configPath)) {
            return configPath
        }
    }
    return null
}

export async function addToNuxtConfig(layerPath: string): Promise<void> {
    const configPath = await findNuxtConfig()

    if (!configPath) {
        throw new Error('nuxt.config.ts or nuxt.config.js not found in current directory')
    }

    let content = await fs.readFile(configPath, 'utf-8')

    // Relative path from project root
    const relativePath = './' + path.relative(process.cwd(), layerPath).replace(/\\/g, '/')

    // Check if layer is already in extends
    if (content.includes(relativePath)) {
        return // Already added
    }

    // Check if extends array exists
    if (content.includes('extends:')) {
        // Add to existing extends array
        const extendsMatch = content.match(/extends:\s*\[([^\]]*)\]/)

        if (extendsMatch) {
            const currentExtends = extendsMatch[0]
            const items = extendsMatch[1].trim()

            if (items) {
                // Add to existing items
                const newExtends = currentExtends.replace(']', `, '${relativePath}']`)
                content = content.replace(currentExtends, newExtends)
            } else {
                // Empty array, add first item
                const newExtends = `extends: ['${relativePath}']`
                content = content.replace(currentExtends, newExtends)
            }
        }
    } else {
        // Add extends property after defineNuxtConfig({
        const insertPoint = content.indexOf('defineNuxtConfig({')
        if (insertPoint !== -1) {
            const insertAfter = content.indexOf('{', insertPoint) + 1
            content = content.slice(0, insertAfter) + `\n  extends: ['${relativePath}'],` + content.slice(insertAfter)
        } else {
            // Handle export default { format
            const altInsertPoint = content.indexOf('export default {')
            if (altInsertPoint !== -1) {
                const insertAfter = content.indexOf('{', altInsertPoint) + 1
                content = content.slice(0, insertAfter) + `\n  extends: ['${relativePath}'],` + content.slice(insertAfter)
            }
        }
    }

    await fs.writeFile(configPath, content)
}

export async function addGitHubLayerToConfig(githubSource: string, dependencies: string[]): Promise<void> {
    const configPath = await findNuxtConfig()

    if (!configPath) {
        throw new Error('nuxt.config.ts or nuxt.config.js not found in current directory')
    }

    let content = await fs.readFile(configPath, 'utf-8')

    // Check if layer is already in extends
    if (content.includes(githubSource)) {
        return // Already added
    }

    // Check if extends array exists
    if (content.includes('extends:')) {
        // Add to existing extends array
        const extendsMatch = content.match(/extends:\s*\[([^\]]*)\]/)

        if (extendsMatch) {
            const currentExtends = extendsMatch[0]
            const items = extendsMatch[1].trim()

            if (items) {
                // Add to existing items with install: true for dependencies
                const layerEntry = dependencies.length > 0
                    ? `['${githubSource}', { install: true }]`
                    : `'${githubSource}'`
                const newExtends = currentExtends.replace(']', `, ${layerEntry}]`)
                content = content.replace(currentExtends, newExtends)
            } else {
                // Empty array, add first item
                const layerEntry = dependencies.length > 0
                    ? `['${githubSource}', { install: true }]`
                    : `'${githubSource}'`
                const newExtends = `extends: [${layerEntry}]`
                content = content.replace(currentExtends, newExtends)
            }
        }
    } else {
        // Add extends property after defineNuxtConfig({
        const layerEntry = dependencies.length > 0
            ? `['${githubSource}', { install: true }]`
            : `'${githubSource}'`

        const insertPoint = content.indexOf('defineNuxtConfig({')
        if (insertPoint !== -1) {
            const insertAfter = content.indexOf('{', insertPoint) + 1
            content = content.slice(0, insertAfter) + `\n  extends: [${layerEntry}],` + content.slice(insertAfter)
        } else {
            // Handle export default { format
            const altInsertPoint = content.indexOf('export default {')
            if (altInsertPoint !== -1) {
                const insertAfter = content.indexOf('{', altInsertPoint) + 1
                content = content.slice(0, insertAfter) + `\n  extends: [${layerEntry}],` + content.slice(insertAfter)
            }
        }
    }

    await fs.writeFile(configPath, content)
}

export async function removeFromNuxtConfig(layerPath: string): Promise<void> {
    const configPath = await findNuxtConfig()

    if (!configPath) {
        return
    }

    let content = await fs.readFile(configPath, 'utf-8')

    const relativePath = './' + path.relative(process.cwd(), layerPath).replace(/\\/g, '/')

    // Remove the layer from extends array
    // Handle various formats: './layers/name', "./layers/name", `./layers/name`
    const escapedPath = relativePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const patterns = [
        new RegExp(`'${escapedPath}'\\s*,?\\s*`),
        new RegExp(`"${escapedPath}"\\s*,?\\s*`),
    ]

    for (const pattern of patterns) {
        content = content.replace(pattern, '')
    }

    // Clean up trailing commas
    content = content.replace(/,(\s*\])/g, '$1')

    // Clean up leading commas in array
    content = content.replace(/\[\s*,/g, '[')

    await fs.writeFile(configPath, content)
}

export async function getInstalledLayers(): Promise<string[]> {
    const layersDir = path.join(process.cwd(), 'layers')

    if (!await fs.pathExists(layersDir)) {
        return []
    }

    const entries = await fs.readdir(layersDir, { withFileTypes: true })

    return entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
}

export async function readLayerManifest(layerDir: string): Promise<any | null> {
    const manifestPath = path.join(layerDir, 'layer.json')

    if (await fs.pathExists(manifestPath)) {
        return await fs.readJson(manifestPath)
    }

    return null
}
