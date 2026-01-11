/**
 * Supabase Adapter
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { DatabaseAdapter, Document, QueryOptions } from '../../types'

let client: SupabaseClient | null = null

export function createSupabaseAdapter(url: string, serviceKey: string): DatabaseAdapter {
    if (!client) {
        client = createClient(url, serviceKey)
    }

    const applyQuery = (query: any, options?: QueryOptions) => {
        if (options?.where) {
            for (const [field, value] of Object.entries(options.where)) {
                query = query.eq(field, value)
            }
        }

        if (options?.orderBy) {
            query = query.order(options.orderBy.field, { ascending: options.orderBy.direction === 'asc' })
        }

        if (options?.limit) {
            query = query.limit(options.limit)
        }

        if (options?.offset) {
            query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
        }

        return query
    }

    return {
        async create(collection, data) {
            const { data: result, error } = await client!
                .from(collection)
                .insert({ ...data, created_at: new Date().toISOString() })
                .select()
                .single()

            if (error) throw new Error(error.message)
            return result as Document
        },

        async findById(collection, id) {
            const { data, error } = await client!
                .from(collection)
                .select('*')
                .eq('id', id)
                .single()

            if (error && error.code !== 'PGRST116') throw new Error(error.message)
            return data as Document | null
        },

        async findMany(collection, options) {
            let query = client!.from(collection).select('*')
            query = applyQuery(query, options)

            const { data, error } = await query
            if (error) throw new Error(error.message)
            return data as Document[]
        },

        async findOne(collection, options) {
            const results = await this.findMany(collection, { ...options, limit: 1 })
            return results[0] || null
        },

        async update(collection, id, data) {
            const { data: result, error } = await client!
                .from(collection)
                .update({ ...data, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single()

            if (error) throw new Error(error.message)
            return result as Document
        },

        async delete(collection, id) {
            const { error } = await client!
                .from(collection)
                .delete()
                .eq('id', id)

            if (error) throw new Error(error.message)
            return true
        },

        async count(collection, options) {
            let query = client!.from(collection).select('*', { count: 'exact', head: true })
            query = applyQuery(query, options)

            const { count, error } = await query
            if (error) throw new Error(error.message)
            return count || 0
        },

        async createMany(collection, data) {
            const { data: results, error } = await client!
                .from(collection)
                .insert(data.map(d => ({ ...d, created_at: new Date().toISOString() })))
                .select()

            if (error) throw new Error(error.message)
            return results as Document[]
        },

        async raw(query) {
            return client!.rpc(query.function, query.params)
        }
    }
}
