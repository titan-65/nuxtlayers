import chalk from 'chalk'
import ora from 'ora'
import fs from 'fs-extra'
import path from 'path'
import { removeFromNuxtConfig } from '../utils/config'

export async function removeLayers(layerName: string) {
    const spinner = ora(`Removing ${chalk.cyan(layerName)}...`).start()

    try {
        // Normalize layer name to directory format
        const dirName = layerName.replace('@', '').replace('/', '-')
        const layerPath = path.join(process.cwd(), 'layers', dirName)

        if (!await fs.pathExists(layerPath)) {
            spinner.fail(`Layer ${chalk.red(layerName)} not found in ./layers`)
            return
        }

        // Remove from nuxt.config.ts
        spinner.text = 'Updating nuxt.config.ts...'
        await removeFromNuxtConfig(layerPath)

        // Delete layer directory
        spinner.text = 'Removing layer files...'
        await fs.remove(layerPath)

        spinner.succeed(`Removed ${chalk.green(layerName)}`)

    } catch (error: any) {
        spinner.fail(`Failed to remove layer: ${error.message}`)
    }
}
