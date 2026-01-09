import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import { getInstalledLayers, readLayerManifest } from '../utils/config'

interface InstalledLayer {
    name: string
    version: string
    description: string
    path: string
    tags: string[]
}

export async function listLayers() {
    const layerDirs = await getInstalledLayers()

    if (layerDirs.length === 0) {
        console.log('')
        console.log(chalk.gray('  No layers installed yet.'))
        console.log('')
        console.log(chalk.gray('  Run ') + chalk.cyan('nuxt-layers add <layer>') + chalk.gray(' to install one.'))
        console.log(chalk.gray('  Run ') + chalk.cyan('nuxt-layers search <query>') + chalk.gray(' to find layers.'))
        console.log('')
        return
    }

    const layers: InstalledLayer[] = []
    const layersBasePath = path.join(process.cwd(), 'layers')

    for (const dirName of layerDirs) {
        const layerPath = path.join(layersBasePath, dirName)
        const manifest = await readLayerManifest(layerPath)

        if (manifest) {
            layers.push({
                name: manifest.name || dirName,
                version: manifest.version || 'unknown',
                description: manifest.description || '',
                path: `./layers/${dirName}`,
                tags: manifest.tags || []
            })
        } else {
            // Layer without manifest - still show it
            layers.push({
                name: dirName,
                version: 'unknown',
                description: '',
                path: `./layers/${dirName}`,
                tags: []
            })
        }
    }

    console.log('')
    console.log(chalk.bold(`  Installed Layers (${layers.length}):`))
    console.log('')

    for (const layer of layers) {
        console.log(`  ${chalk.green('●')} ${chalk.cyan(layer.name)} ${chalk.gray('v' + layer.version)}`)

        if (layer.description) {
            console.log(`    ${chalk.gray(layer.description)}`)
        }

        console.log(`    ${chalk.gray('→')} ${chalk.gray(layer.path)}`)

        if (layer.tags.length > 0) {
            console.log(`    ${chalk.gray(layer.tags.map(t => `#${t}`).join(' '))}`)
        }

        console.log('')
    }
}
