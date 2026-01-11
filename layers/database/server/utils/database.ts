/**
 * Unified Database Utility
 * Automatically selects the correct adapter based on runtime config
 */
import type { DatabaseAdapter, DatabaseProvider } from '../types'
import { createFirebaseAdapter } from './adapters/firebase'
import { createSupabaseAdapter } from './adapters/supabase'
import { createPostgresAdapter } from './adapters/postgres'
import { createMongoAdapter } from './adapters/mongodb'
import { createConvexAdapter } from './adapters/convex'

let cachedAdapter: DatabaseAdapter | null = null

/**
 * Get the database adapter based on runtime configuration
 */
export function getDatabase(): DatabaseAdapter {
    if (cachedAdapter) return cachedAdapter

    const config = useRuntimeConfig()
    const dbConfig = config.database
    const provider = dbConfig.provider as DatabaseProvider

    switch (provider) {
        case 'firebase':
            cachedAdapter = createFirebaseAdapter()
            break

        case 'supabase':
            if (!dbConfig.supabaseUrl || !dbConfig.supabaseServiceKey) {
                throw new Error('Supabase requires supabaseUrl and supabaseServiceKey')
            }
            cachedAdapter = createSupabaseAdapter(dbConfig.supabaseUrl, dbConfig.supabaseServiceKey)
            break

        case 'neon':
        case 'postgres':
            if (!dbConfig.postgresUrl) {
                throw new Error('PostgreSQL/Neon requires postgresUrl')
            }
            cachedAdapter = createPostgresAdapter(dbConfig.postgresUrl)
            break

        case 'mongodb':
            if (!dbConfig.mongodbUri) {
                throw new Error('MongoDB requires mongodbUri')
            }
            cachedAdapter = createMongoAdapter(dbConfig.mongodbUri)
            break

        case 'convex':
            if (!dbConfig.convexUrl) {
                throw new Error('Convex requires convexUrl')
            }
            cachedAdapter = createConvexAdapter(dbConfig.convexUrl)
            break

        default:
            throw new Error(`Unknown database provider: ${provider}`)
    }

    return cachedAdapter
}

/**
 * Get the current database provider name
 */
export function getDatabaseProvider(): DatabaseProvider {
    const config = useRuntimeConfig()
    return config.database.provider as DatabaseProvider
}

// Re-export types
export type { DatabaseAdapter, Document, QueryOptions, DatabaseProvider } from '../types'
