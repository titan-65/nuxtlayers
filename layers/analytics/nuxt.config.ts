// @vantol/analytics layer configuration
export default defineNuxtConfig({
    $meta: {
        name: '@vantol/analytics',
        version: '1.0.0'
    },

    runtimeConfig: {
        public: {
            analytics: {
                enabled: process.env.NUXT_PUBLIC_ANALYTICS_ENABLED !== 'false',
                trackPageViews: true,
                trackEvents: true,
                anonymize: false
            }
        }
    }
})
