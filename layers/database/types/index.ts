/**
 * Unified Database Types
 * Provider-agnostic type definitions for database operations
 */

export type DatabaseProvider = 'firebase' | 'supabase' | 'neon' | 'convex' | 'postgres' | 'mongodb'

export interface QueryOptions {
    where?: Record<string, any>
    orderBy?: { field: string; direction: 'asc' | 'desc' }
    limit?: number
    offset?: number
}

export interface Document {
    id: string
    [key: string]: any
}

export interface DatabaseAdapter {
    // CRUD Operations
    create(collection: string, data: Record<string, any>): Promise<Document>
    findById(collection: string, id: string): Promise<Document | null>
    findMany(collection: string, options?: QueryOptions): Promise<Document[]>
    findOne(collection: string, options?: QueryOptions): Promise<Document | null>
    update(collection: string, id: string, data: Record<string, any>): Promise<Document>
    delete(collection: string, id: string): Promise<boolean>
    count(collection: string, options?: QueryOptions): Promise<number>

    // Batch Operations
    createMany?(collection: string, data: Record<string, any>[]): Promise<Document[]>
    deleteMany?(collection: string, options?: QueryOptions): Promise<number>

    // Raw Query (provider-specific)
    raw?<T = any>(query: any): Promise<T>
}

export interface DatabaseConfig {
    provider: DatabaseProvider
    [key: string]: any
}
