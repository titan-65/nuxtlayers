import chalk from 'chalk'
import ora from 'ora'
import { searchRegistry } from '../utils/registry'

export async function searchLayers(query: string) {
    const spinner = ora(`Searching for "${query}"...`).start()

    try {
        const results = await searchRegistry(query)

        if (results.length === 0) {
            spinner.info(`No layers found for "${query}"`)
            return
        }

        spinner.stop()

        console.log(chalk.bold(`\nFound ${results.length} layers:\n`))

        for (const layer of results) {
            const officialBadge = layer.official ? chalk.green('[Official]') : ''
            console.log(`  ${chalk.cyan(layer.name)} ${chalk.gray('v' + layer.version)} ${officialBadge}`)
            console.log(`  ${chalk.gray(layer.description)}`)
            console.log(`  ${chalk.gray('↓ ' + layer.downloads + ' downloads')}\n`)
        }

        console.log(chalk.gray(`Run \`nuxt-layers add <layer>\` to install`))

    } catch (error: any) {
        spinner.fail(`Search failed: ${error.message}`)
    }
}
