import chalk from 'chalk'
import ora from 'ora'
import fs from 'fs-extra'
import path from 'path'
import { getInstalledLayers, readLayerManifest, findNuxtConfig } from '../utils/config'
import { fetchLayer } from '../utils/registry'

interface UpdateResult {
    name: string
    currentVersion: string
    latestVersion: string
    updated: boolean
}

export async function updateLayers() {
    const spinner = ora('Checking for updates...').start()

    try {
        // Check if we're in a Nuxt project
        const nuxtConfig = await findNuxtConfig()
        if (!nuxtConfig) {
            spinner.fail('Not a Nuxt project (no nuxt.config found)')
            return
        }

        const layerDirs = await getInstalledLayers()

        if (layerDirs.length === 0) {
            spinner.info('No layers installed')
            return
        }

        const layersBasePath = path.join(process.cwd(), 'layers')
        const results: UpdateResult[] = []

        for (const dirName of layerDirs) {
            const layerPath = path.join(layersBasePath, dirName)
            const manifest = await readLayerManifest(layerPath)

            if (!manifest || !manifest.name) {
                continue
            }

            spinner.text = `Checking ${manifest.name}...`

            try {
                const latest = await fetchLayer(manifest.name)

                if (latest) {
                    const hasUpdate = manifest.version !== latest.version

                    results.push({
                        name: manifest.name,
                        currentVersion: manifest.version || 'unknown',
                        latestVersion: latest.version,
                        updated: hasUpdate
                    })
                }
            } catch {
                // Silently skip layers that can't be checked
            }
        }

        spinner.stop()

        if (results.length === 0) {
            console.log(chalk.gray('No layers to check.'))
            return
        }

        const updatesAvailable = results.filter(r => r.updated)

        if (updatesAvailable.length === 0) {
            console.log('')
            console.log(chalk.green('  ✓ All layers are up to date!'))
            console.log('')
            return
        }

        console.log('')
        console.log(chalk.bold(`  Updates available (${updatesAvailable.length}):`))
        console.log('')

        for (const result of updatesAvailable) {
            console.log(`  ${chalk.yellow('●')} ${chalk.cyan(result.name)}`)
            console.log(`    ${chalk.gray(result.currentVersion)} → ${chalk.green(result.latestVersion)}`)
            console.log('')
        }

        console.log(chalk.gray('  To update, remove and re-add each layer:'))
        console.log('')

        for (const result of updatesAvailable) {
            const dirName = result.name.replace('@', '').replace('/', '-')
            console.log(chalk.gray(`    nuxt-layers remove ${result.name}`))
            console.log(chalk.gray(`    nuxt-layers add ${result.name}`))
        }
        console.log('')

    } catch (error: any) {
        spinner.fail(`Update check failed: ${error.message}`)
    }
}
