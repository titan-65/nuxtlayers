/**
 * Convex Adapter
 */
import { ConvexHttpClient } from 'convex/browser'
import type { DatabaseAdapter, Document, QueryOptions } from '../../types'

let client: ConvexHttpClient | null = null

export function createConvexAdapter(url: string): DatabaseAdapter {
    if (!client) {
        client = new ConvexHttpClient(url)
    }

    return {
        async create(collection, data) {
            const id = await client!.mutation(`${collection}:create`, {
                ...data, createdAt: Date.now(), updatedAt: Date.now()
            })
            return { id, ...data }
        },

        async findById(collection, id) {
            const doc = await client!.query(`${collection}:getById`, { id })
            if (!doc) return null
            return { id: doc._id, ...doc } as Document
        },

        async findMany(collection, options) {
            const docs = await client!.query(`${collection}:list`, {
                ...options?.where, limit: options?.limit, offset: options?.offset
            })
            return docs.map((doc: any) => ({ id: doc._id, ...doc }))
        },

        async findOne(collection, options) {
            const results = await this.findMany(collection, { ...options, limit: 1 })
            return results[0] || null
        },

        async update(collection, id, data) {
            await client!.mutation(`${collection}:update`, { id, ...data, updatedAt: Date.now() })
            return this.findById(collection, id) as Promise<Document>
        },

        async delete(collection, id) {
            await client!.mutation(`${collection}:remove`, { id })
            return true
        },

        async count(collection, options) {
            return await client!.query(`${collection}:count`, options?.where || {}) as number
        },

        async raw(query) {
            return query.type === 'mutation'
                ? client!.mutation(query.name, query.args)
                : client!.query(query.name, query.args)
        }
    }
}
