import { getDb } from '../../utils/firebase'

/**
 * Seed the Firestore database with layer metadata.
 * POST /api/admin/seed
 */
export default defineEventHandler(async (event) => {
    try {
        const db = getDb()
        const layersCollection = db.collection('layers')

        // Check if already seeded
        const existing = await layersCollection.limit(1).get()
        if (!existing.empty) {
            return {
                success: true,
                message: 'Database already seeded',
                count: (await layersCollection.count().get()).data().count
            }
        }

        // Layer metadata to seed
        const layers = [
            {
                id: '@vantol/auth-firebase',
                name: '@vantol/auth-firebase',
                version: '1.0.0',
                description: 'Firebase Authentication with Google SSO, user state management, and admin detection.',
                dependencies: ['firebase'],
                official: true,
                tags: ['auth', 'firebase', 'google', 'sso'],
                downloads: 2400,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                author: { name: 'NuxtLayers Team', email: 'team@nuxtlayers.dev' }
            },
            {
                id: '@vantol/auth-clerk',
                name: '@vantol/auth-clerk',
                version: '1.0.0',
                description: 'Clerk authentication with social providers, multi-factor auth, and beautiful pre-built components.',
                dependencies: ['@clerk/nuxt'],
                official: true,
                tags: ['auth', 'clerk', 'social', 'mfa'],
                downloads: 1200,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                author: { name: 'NuxtLayers Team', email: 'team@nuxtlayers.dev' }
            },
            {
                id: '@vantol/auth-better',
                name: '@vantol/auth-better',
                version: '1.0.0',
                description: 'Better Auth integration with email/password, magic links, and session management.',
                dependencies: ['better-auth'],
                official: true,
                tags: ['auth', 'better-auth', 'email', 'magic-link'],
                downloads: 800,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                author: { name: 'NuxtLayers Team', email: 'team@nuxtlayers.dev' }
            },
            {
                id: '@vantol/blog',
                name: '@vantol/blog',
                version: '1.0.0',
                description: 'Full-featured blog with real-time comments, reactions, bookmarks, and analytics.',
                dependencies: ['firebase'],
                official: true,
                tags: ['blog', 'cms', 'comments', 'analytics'],
                downloads: 1800,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                author: { name: 'NuxtLayers Team', email: 'team@nuxtlayers.dev' }
            },
            {
                id: '@vantol/admin',
                name: '@vantol/admin',
                version: '1.0.0',
                description: 'Admin dashboard with sidebar layout, data tables, charts, and role-based access.',
                dependencies: [],
                official: true,
                tags: ['admin', 'dashboard', 'ui', 'tables'],
                downloads: 1200,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                author: { name: 'NuxtLayers Team', email: 'team@nuxtlayers.dev' }
            },
            {
                id: '@vantol/payments',
                name: '@vantol/payments',
                version: '1.0.0',
                description: 'Stripe integration with checkout, subscriptions, and customer portal.',
                dependencies: ['stripe'],
                official: true,
                tags: ['payments', 'stripe', 'subscriptions', 'billing'],
                downloads: 980,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                author: { name: 'NuxtLayers Team', email: 'team@nuxtlayers.dev' }
            },
            {
                id: '@vantol/landing',
                name: '@vantol/landing',
                version: '1.0.0',
                description: 'Landing page components with hero sections, features, pricing, and testimonials.',
                dependencies: [],
                official: true,
                tags: ['landing', 'marketing', 'ui', 'components'],
                downloads: 650,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                author: { name: 'NuxtLayers Team', email: 'team@nuxtlayers.dev' }
            },
            {
                id: '@vantol/saas-kit',
                name: '@vantol/saas-kit',
                version: '1.0.0',
                description: 'Complete SaaS starter with teams, subscriptions, onboarding, billing, and modern UI.',
                dependencies: ['@vantol/payments', '@vantol/auth-firebase'],
                official: true,
                premium: true,
                tags: ['saas', 'teams', 'billing', 'onboarding', 'dashboard'],
                downloads: 420,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                author: { name: 'NuxtLayers Team', email: 'team@nuxtlayers.dev' }
            },
            {
                id: '@vantol/analytics',
                name: '@vantol/analytics',
                version: '1.0.0',
                description: 'Real-time analytics dashboard with page views, events, and user flow tracking.',
                dependencies: [],
                official: true,
                premium: true,
                tags: ['analytics', 'dashboard', 'charts', 'tracking'],
                downloads: 380,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                author: { name: 'NuxtLayers Team', email: 'team@nuxtlayers.dev' }
            }
        ]

        // Write layers and versions to Firestore
        const batch = db.batch()

        for (const layer of layers) {
            // Sanitize ID for Firestore (remove @ and replace / with -)
            const docId = layer.id.replace('@', '').replace('/', '-')

            // Create layer document
            const layerRef = layersCollection.doc(docId)
            batch.set(layerRef, layer)

            // Create version subcollection with 1.0.0
            const versionRef = layerRef.collection('versions').doc(layer.version)
            batch.set(versionRef, {
                version: layer.version,
                tarballUrl: `https://storage.googleapis.com/layers-854b4.firebasestorage.app/layers/${layer.id.replace('@', '').replace('/', '-')}-${layer.version}.tgz`,
                publishedAt: new Date().toISOString(),
                dependencies: layer.dependencies,
                changelog: 'Initial release'
            })
        }

        await batch.commit()

        return {
            success: true,
            message: 'Database seeded successfully',
            count: layers.length,
            layers: layers.map(l => l.id)
        }

    } catch (error: any) {
        console.error('Seed error:', error)
        throw createError({
            statusCode: 500,
            message: `Failed to seed database: ${error.message}`
        })
    }
})
