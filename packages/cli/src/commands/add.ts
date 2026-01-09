import chalk from 'chalk'
import ora from 'ora'
import fs from 'fs-extra'
import path from 'path'
import { execSync } from 'child_process'
import { fetchLayer, trackDownload, getRegistryUrl } from '../utils/registry'
import { addGitHubLayerToConfig, detectPackageManager } from '../utils/config'

// GitHub repository for layers
const GITHUB_REPO = 'titan-65/nuxtlayers'

export async function addLayer(layerName: string, version?: string) {
    const spinner = ora(`Adding ${chalk.cyan(layerName)}...`).start()

    try {
        // Normalize layer name
        const normalizedName = layerName.startsWith('@') ? layerName : `@vantol/${layerName}`

        // Check if we're in a Nuxt project
        const nuxtConfigPath = path.join(process.cwd(), 'nuxt.config.ts')
        const nuxtConfigJsPath = path.join(process.cwd(), 'nuxt.config.js')

        if (!await fs.pathExists(nuxtConfigPath) && !await fs.pathExists(nuxtConfigJsPath)) {
            spinner.fail('Not a Nuxt project (no nuxt.config.ts or nuxt.config.js found)')
            console.log(chalk.gray('Make sure you\'re in the root of your Nuxt project.'))
            return
        }

        // Fetch layer metadata from registry
        spinner.text = 'Fetching layer metadata...'
        const layer = await fetchLayer(normalizedName, version)

        if (!layer) {
            spinner.fail(`Layer ${chalk.red(normalizedName)} not found`)
            console.log('\n' + chalk.gray(`Registry: ${getRegistryUrl()}`))
            console.log(chalk.gray('Run `nuxt-layers search <query>` to find available layers.'))
            return
        }

        // Build GitHub source string
        const layerDirName = normalizedName.replace('@vantol/', '')
        const githubSource = version
            ? `github:${GITHUB_REPO}/layers/${layerDirName}#v${version}`
            : `github:${GITHUB_REPO}/layers/${layerDirName}`

        // Check if already in config
        const configPath = await fs.pathExists(nuxtConfigPath) ? nuxtConfigPath : nuxtConfigJsPath
        const configContent = await fs.readFile(configPath, 'utf-8')

        if (configContent.includes(githubSource) || configContent.includes(`/${layerDirName}'`)) {
            spinner.warn(`Layer ${chalk.yellow(normalizedName)} is already configured`)
            return
        }

        // Update nuxt.config.ts
        spinner.text = 'Updating nuxt.config.ts...'
        await addGitHubLayerToConfig(githubSource, layer.dependencies || [])

        // Install dependencies
        if (layer.dependencies && layer.dependencies.length > 0) {
            spinner.text = 'Installing dependencies...'
            const pm = await detectPackageManager()
            const installCmd = pm === 'pnpm' ? 'pnpm add' : pm === 'yarn' ? 'yarn add' : 'npm install'

            try {
                execSync(`${installCmd} ${layer.dependencies.join(' ')}`, {
                    cwd: process.cwd(),
                    stdio: 'pipe'
                })
            } catch (err) {
                console.log(chalk.yellow('\nWarning: Some dependencies may need manual installation.'))
            }
        }

        await trackDownload(normalizedName)
        spinner.succeed(`Added ${chalk.green(normalizedName)} v${layer.version}`)

        console.log('')
        console.log(chalk.gray('  Source:') + ` ${githubSource}`)
        console.log(chalk.gray('  Config:') + ' extends array updated')
        console.log('')
        console.log(chalk.cyan('Next steps:'))
        console.log(chalk.gray('  1. Restart your dev server'))
        console.log(chalk.gray('  2. Nuxt will fetch the layer automatically'))

    } catch (error: any) {
        spinner.fail(`Failed to add layer: ${error.message}`)
        if (process.env.DEBUG) console.error(error)
    }
}
