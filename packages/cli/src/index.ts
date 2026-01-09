import { Command } from 'commander'
import chalk from 'chalk'
import { addLayer } from './commands/add'
import { listLayers } from './commands/list'
import { searchLayers } from './commands/search'
import { updateLayers } from './commands/update'
import { removeLayers } from './commands/remove'

const program = new Command()

program
    .name('nuxt-layers')
    .description('CLI to discover and install Nuxt Layers')
    .version('0.0.1')

program
    .command('add <layer>')
    .description('Add a layer to your Nuxt project')
    .option('-v, --version <version>', 'Specific version to install')
    .action(async (layer, options) => {
        await addLayer(layer, options.version)
    })

program
    .command('list')
    .alias('ls')
    .description('List installed layers')
    .action(async () => {
        await listLayers()
    })

program
    .command('search <query>')
    .description('Search for layers in the registry')
    .action(async (query) => {
        await searchLayers(query)
    })

program
    .command('update')
    .description('Update all installed layers')
    .action(async () => {
        await updateLayers()
    })

program
    .command('remove <layer>')
    .alias('rm')
    .description('Remove a layer from your project')
    .action(async (layer) => {
        await removeLayers(layer)
    })

program.parse()
