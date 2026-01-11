#!/usr/bin/env node

/**
 * Script to create stub versions of premium layers for the public repository.
 * 
 * Stubs contain:
 * - layer.json with full metadata
 * - README.md with installation instructions
 * - A placeholder nuxt.config.ts that shows a "license required" message
 * 
 * The actual layer code is NOT in the public repo - it's only available
 * through the protected download API after license validation.
 * 
 * Usage:
 *   node scripts/create-stubs.mjs
 */

import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const LAYERS_DIR = path.join(__dirname, '..', 'layers')
const STUBS_DIR = path.join(__dirname, '..', 'layers-stubs')

// Premium layers that need stubs
const PREMIUM_LAYERS = [
    {
        id: 'saas-kit',
        name: '@vantol/saas-kit',
        description: 'Complete SaaS starter with teams, subscriptions, onboarding, billing, and modern UI.',
        features: [
            'Team management with roles',
            'Subscription & billing integration',
            'Multi-step onboarding wizard',
            'Modern dashboard UI',
            'Settings pages (profile, team, members, billing)',
            'Pinia stores for state management'
        ],
        price: '$49/mo',
        dependencies: ['@vantol/payments', '@vantol/auth-firebase']
    },
    {
        id: 'analytics',
        name: '@vantol/analytics',
        description: 'Real-time analytics dashboard with page views, events, and user flow tracking.',
        features: [
            'Privacy-focused (no cookies)',
            'Real-time page view tracking',
            'Custom event tracking',
            'Beautiful dashboard with charts',
            'Traffic sources breakdown',
            'Export to CSV/JSON'
        ],
        price: '$29/mo',
        dependencies: []
    },
    {
        id: 'payments',
        name: '@vantol/payments',
        description: 'Stripe and Polar integration with checkout, subscriptions, and customer portal.',
        features: [
            'Stripe integration',
            'Polar.sh integration',
            'Checkout flow',
            'Subscription management',
            'Customer portal',
            'License validation'
        ],
        price: '$39/mo',
        dependencies: []
    }
]

async function createStub(layer) {
    const stubDir = path.join(STUBS_DIR, layer.id)

    // Clean and create directory
    await fs.remove(stubDir)
    await fs.ensureDir(stubDir)

    // Create layer.json
    const layerJson = {
        id: layer.name,
        name: layer.name,
        version: '1.0.0',
        description: layer.description,
        category: 'Premium',
        author: 'Vantol',
        license: 'premium',
        premium: true,
        price: layer.price,
        features: layer.features,
        dependencies: layer.dependencies,
        github: `github:titan-65/nuxtlayers/layers/${layer.id}`,
        docs: `https://nuxtlayers.dev/docs/${layer.id}`,
        installCommand: `npx nuxt-layers add ${layer.name}`
    }

    await fs.writeJson(path.join(stubDir, 'layer.json'), layerJson, { spaces: 2 })
    console.log(`  ✓ Created layer.json`)

    // Create README.md
    const readme = `# ${layer.name}

${layer.description}

## 🔐 Premium Layer

This is a premium layer that requires a valid license to use.

**Price:** ${layer.price}

## Features

${layer.features.map(f => `- ${f}`).join('\n')}

## Installation

1. **Purchase a license** at [nuxtlayers.dev/pricing](https://nuxtlayers.dev/pricing)

2. **Install with your license key:**
   \`\`\`bash
   npx nuxt-layers add ${layer.name} --license YOUR_LICENSE_KEY
   \`\`\`

3. **Configure in your nuxt.config.ts:**
   \`\`\`ts
   export default defineNuxtConfig({
     extends: ['${layer.name}']
   })
   \`\`\`

## Documentation

Full documentation available at [nuxtlayers.dev/docs/${layer.id}](https://nuxtlayers.dev/docs/${layer.id})

## Support

- 📧 Email: support@nuxtlayers.dev
- 💬 Discord: [Join our community](https://discord.gg/nuxtlayers)
- 🐛 Issues: [GitHub Issues](https://github.com/titan-65/nuxtlayers/issues)

---

© ${new Date().getFullYear()} NuxtLayers. All rights reserved.
`
    await fs.writeFile(path.join(stubDir, 'README.md'), readme)
    console.log(`  ✓ Created README.md`)

    // Create placeholder nuxt.config.ts
    const nuxtConfig = `// ${layer.name} - Premium Layer
// 
// This is a stub. The full layer is available after license validation.
// Purchase at: https://nuxtlayers.dev/pricing

export default defineNuxtConfig({
    $meta: {
        name: '${layer.name}',
        version: '1.0.0'
    },

    hooks: {
        'app:created': () => {
            console.warn([
                '',
                '⚠️  ${layer.name} is a PREMIUM layer.',
                '',
                '   This stub does not include the actual layer code.',
                '   To use this layer, you need a valid license.',
                '',
                '   1. Purchase at: https://nuxtlayers.dev/pricing',
                '   2. Install with: npx nuxt-layers add ${layer.name} --license YOUR_KEY',
                ''
            ].join('\\n'))
        }
    }
})
`
    await fs.writeFile(path.join(stubDir, 'nuxt.config.ts'), nuxtConfig)
    console.log(`  ✓ Created nuxt.config.ts (stub)`)
}

async function main() {
    console.log('📁 Creating Premium Layer Stubs\n')
    console.log('These stubs will be in the PUBLIC repo for discoverability.')
    console.log('Actual code is only available via the protected download API.\n')

    await fs.ensureDir(STUBS_DIR)

    for (const layer of PREMIUM_LAYERS) {
        console.log(`\n[${layer.id}]`)
        await createStub(layer)
    }

    console.log('\n' + '='.repeat(50))
    console.log('✅ Stubs created in: layers-stubs/')
    console.log('='.repeat(50))
    console.log('\nNext steps:')
    console.log('1. Move actual premium layer code to a PRIVATE location')
    console.log('2. Replace layers/<premium-id>/ with layers-stubs/<premium-id>/')
    console.log('3. Run upload-layers.mjs to upload the actual code to Firebase Storage')
}

main().catch(console.error)
