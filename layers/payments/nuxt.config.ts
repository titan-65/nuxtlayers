// @vantol/payments layer configuration
export default defineNuxtConfig({
    $meta: {
        name: '@vantol/payments',
        version: '1.0.0'
    },

    runtimeConfig: {
        stripe: {
            secretKey: process.env.STRIPE_SECRET_KEY || '',
            webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
        },
        public: {
            stripe: {
                publishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
            }
        }
    }
})
