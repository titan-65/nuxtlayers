// @vantol/auth-clerk layer configuration
export default defineNuxtConfig({
    $meta: {
        name: '@vantol/auth-clerk',
        version: '1.0.0'
    },

    modules: ['@clerk/nuxt'],

    clerk: {
        // Clerk is configured via environment variables:
        // NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY
        // CLERK_SECRET_KEY
    }
})
