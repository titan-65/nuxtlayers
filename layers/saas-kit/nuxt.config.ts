// @vantol/saas-kit - Premium Layer
// 
// This is a stub. The full layer is available after license validation.
// Purchase at: https://nuxtlayers.dev/pricing

export default defineNuxtConfig({
    $meta: {
        name: '@vantol/saas-kit',
        version: '1.0.0'
    },

    hooks: {
        'app:created': () => {
            console.warn([
                '',
                '⚠️  @vantol/saas-kit is a PREMIUM layer.',
                '',
                '   This stub does not include the actual layer code.',
                '   To use this layer, you need a valid license.',
                '',
                '   1. Purchase at: https://nuxtlayers.dev/pricing',
                '   2. Install with: npx nuxt-layers add @vantol/saas-kit --license YOUR_KEY',
                ''
            ].join('\n'))
        }
    }
})
