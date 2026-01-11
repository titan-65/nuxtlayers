// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },

    future: {
        compatibilityVersion: 4
    },

    // Extend auth-firebase, blog, payments, saas-kit, and analytics layers (dogfooding!)
    extends: [
        '../../layers/auth-firebase',
        '../../layers/blog',
        '../../layers/payments',
        '../../layers/saas-kit',
        '../../layers/analytics'
    ],

    modules: [
        '@nuxt/eslint',
        '@nuxtjs/tailwindcss',
        'shadcn-nuxt',
        '@pinia/nuxt'
    ],

    shadcn: {
        prefix: '',
        componentDir: './components/ui'
    },

    css: ['~/assets/css/main.css'],

    app: {
        head: {
            title: 'NuxtLayers - Discover & Install Nuxt Layers',
            meta: [
                { name: 'description', content: 'A marketplace for Nuxt Layers. Discover, preview, and install pre-built layers via CLI.' }
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
            ]
        }
    },

    runtimeConfig: {
        // Server-side only
        firebaseServiceAccount: process.env.FIREBASE_SERVICE_ACCOUNT,
        adminApiKey: process.env.ADMIN_API_KEY || 'dev-admin-key',

        // Public (client + server)
        public: {
            adminEmails: process.env.NUXT_PUBLIC_ADMIN_EMAILS || '',
            firebase: {
                apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
                authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
                storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
                appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID
            },
            // Blog layer config
            blog: {
                title: 'Changelog',
                description: 'Latest updates, tutorials, and announcements from NuxtLayers',
                basePath: '/blog',
                postsPerPage: 10,
                authorName: 'NuxtLayers Team',
                theme: 'dark'
            }
        }
    },

    compatibilityDate: '2025-01-01'
})
