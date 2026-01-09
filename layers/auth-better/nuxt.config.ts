// @vantol/auth-better layer configuration
export default defineNuxtConfig({
    $meta: {
        name: '@vantol/auth-better',
        version: '1.0.0'
    },

    // Better Auth configuration
    runtimeConfig: {
        // Server-side secrets
        betterAuth: {
            secret: process.env.BETTER_AUTH_SECRET || '',
            baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000'
        },
        public: {
            // Client-side config
        }
    }
})
