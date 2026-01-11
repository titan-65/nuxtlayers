#!/usr/bin/env node

/**
 * Script to backup premium layer source code and replace with stubs.
 * 
 * This script:
 * 1. Moves premium layer source code to layers-private/
 * 2. Copies stubs from layers-stubs/ to layers/
 * 
 * After running this, the public repo will only have stubs.
 * The actual source is in layers-private/ (which is gitignored).
 * 
 * Usage:
 *   node scripts/replace-with-stubs.mjs
 */

import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const LAYERS_DIR = path.join(__dirname, '..', 'layers')
const STUBS_DIR = path.join(__dirname, '..', 'layers-stubs')
const PRIVATE_DIR = path.join(__dirname, '..', 'layers-private')

// Premium layers to process
const PREMIUM_LAYERS = ['saas-kit', 'analytics', 'payments']

async function main() {
    console.log('🔄 Replacing Premium Layers with Stubs\n')

    // Create private directory
    await fs.ensureDir(PRIVATE_DIR)
    console.log(`✓ Created ${PRIVATE_DIR}`)

    for (const layerId of PREMIUM_LAYERS) {
        console.log(`\n[${layerId}]`)

        const sourcePath = path.join(LAYERS_DIR, layerId)
        const stubPath = path.join(STUBS_DIR, layerId)
        const privatePath = path.join(PRIVATE_DIR, layerId)

        // Check if source exists
        if (!await fs.pathExists(sourcePath)) {
            console.log(`  ⚠ Source not found: ${sourcePath}`)
            continue
        }

        // Check if stub exists
        if (!await fs.pathExists(stubPath)) {
            console.log(`  ⚠ Stub not found: ${stubPath}`)
            console.log(`  → Run 'node scripts/create-stubs.mjs' first`)
            continue
        }

        // Move source to private
        console.log(`  → Moving source to layers-private/${layerId}/`)
        await fs.remove(privatePath) // Clean if exists
        await fs.move(sourcePath, privatePath)
        console.log(`  ✓ Moved to private location`)

        // Copy stub to layers
        console.log(`  → Copying stub to layers/${layerId}/`)
        await fs.copy(stubPath, sourcePath)
        console.log(`  ✓ Replaced with stub`)
    }

    console.log('\n' + '='.repeat(50))
    console.log('✅ Premium layers replaced with stubs!')
    console.log('='.repeat(50))
    console.log('\nSummary:')
    console.log('  • Original source code: layers-private/')
    console.log('  • Public stubs:         layers/<layer-id>/')
    console.log('')
    console.log('Next steps:')
    console.log('  1. git add -A')
    console.log('  2. git commit -m "Replace premium layers with stubs"')
    console.log('  3. Run upload-layers.mjs to upload source to Firebase')
    console.log('  4. The layers-private/ directory is gitignored')
}

main().catch(console.error)
