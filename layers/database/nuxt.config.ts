// @vantol/database
// Database-agnostic layer with unified API for multiple providers

export default defineNuxtConfig({
    $meta: {
        name: '@vantol/database',
        version: '1.0.0'
    },

    runtimeConfig: {
        // Database configuration (server only)
        database: {
            // Provider: 'firebase' | 'supabase' | 'neon' | 'convex' | 'postgres' | 'mongodb'
            provider: 'firebase',

            // Firebase
            firebaseServiceAccount: '',

            // Supabase
            supabaseUrl: '',
            supabaseServiceKey: '',

            // Neon / PostgreSQL
            postgresUrl: '',

            // MongoDB
            mongodbUri: '',

            // Convex
            convexUrl: '',
            convexDeployKey: ''
        }
    }
})
