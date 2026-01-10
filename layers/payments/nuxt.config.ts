// @vantol/payments layer configuration
export default defineNuxtConfig({
    $meta: {
        name: '@vantol/payments',
        version: '1.0.0'
    },

    runtimeConfig: {
        // Stripe configuration
        stripe: {
            secretKey: process.env.STRIPE_SECRET_KEY || '',
            webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
        },
        // Polar configuration
        polar: {
            accessToken: process.env.POLAR_ACCESS_TOKEN || '',
            webhookSecret: process.env.POLAR_WEBHOOK_SECRET || '',
            sandbox: process.env.POLAR_SANDBOX === 'true',
            productPro: process.env.POLAR_PRODUCT_PRO || '',
            productTeam: process.env.POLAR_PRODUCT_TEAM || ''
        },
        public: {
            stripe: {
                publishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
            },
            payments: {
                provider: process.env.NUXT_PUBLIC_PAYMENTS_PROVIDER || 'polar'
            }
        }
    }
})
