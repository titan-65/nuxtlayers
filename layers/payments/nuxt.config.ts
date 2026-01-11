// @vantol/payments - Premium Layer
// 
// This is a stub. The full layer is available after license validation.
// Purchase at: https://nuxtlayers.dev/pricing

export default defineNuxtConfig({
    $meta: {
        name: '@vantol/payments',
        version: '1.0.0'
    },

    hooks: {
        'app:created': () => {
            console.warn([
                '',
                '⚠️  @vantol/payments is a PREMIUM layer.',
                '',
                '   This stub does not include the actual layer code.',
                '   To use this layer, you need a valid license.',
                '',
                '   1. Purchase at: https://nuxtlayers.dev/pricing',
                '   2. Install with: npx nuxt-layers add @vantol/payments --license YOUR_KEY',
                ''
            ].join('\n'))
        }
    }
})
