// @vantol/saas-kit layer configuration
export default defineNuxtConfig({
    $meta: {
        name: '@vantol/saas-kit',
        version: '1.0.0'
    },

    // Layer dependencies
    extends: [
        '../payments'  // Extends payments layer for billing
    ],

    runtimeConfig: {
        public: {
            saasKit: {
                appName: process.env.NUXT_PUBLIC_SAAS_APP_NAME || 'My SaaS App',
                trialDays: parseInt(process.env.NUXT_PUBLIC_SAAS_TRIAL_DAYS || '14'),
                maxTeamMembers: parseInt(process.env.NUXT_PUBLIC_SAAS_MAX_MEMBERS || '5'),
                features: {
                    teams: true,
                    billing: true,
                    onboarding: true
                }
            }
        }
    }
})
