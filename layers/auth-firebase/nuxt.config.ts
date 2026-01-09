// @vantol/auth-firebase layer configuration
export default defineNuxtConfig({
    $meta: {
        name: '@vantol/auth-firebase',
        version: '1.0.0'
    },

    // Ensure composables are auto-imported
    imports: {
        dirs: ['composables']
    }
})
