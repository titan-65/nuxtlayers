/**
 * useDatabase Composable
 * Client-side database operations via API
 */

export interface UseDatabase {
    create: <T = any>(collection: string, data: Record<string, any>) => Promise<T>
    findById: <T = any>(collection: string, id: string) => Promise<T | null>
    findMany: <T = any>(collection: string, options?: QueryOptions) => Promise<T[]>
    findOne: <T = any>(collection: string, options?: QueryOptions) => Promise<T | null>
    update: <T = any>(collection: string, id: string, data: Record<string, any>) => Promise<T>
    delete: (collection: string, id: string) => Promise<boolean>
    count: (collection: string, options?: QueryOptions) => Promise<number>
}

interface QueryOptions {
    where?: Record<string, any>
    orderBy?: { field: string; direction: 'asc' | 'desc' }
    limit?: number
    offset?: number
}

export function useDatabase(): UseDatabase {
    const apiBase = '/api/db'

    return {
        async create<T = any>(collection: string, data: Record<string, any>) {
            const response = await $fetch<{ data: T }>(`${apiBase}/${collection}`, {
                method: 'POST',
                body: data
            })
            return response.data
        },

        async findById<T = any>(collection: string, id: string) {
            try {
                const response = await $fetch<{ data: T }>(`${apiBase}/${collection}/${id}`)
                return response.data
            } catch (e: any) {
                if (e.statusCode === 404) return null
                throw e
            }
        },

        async findMany<T = any>(collection: string, options?: QueryOptions) {
            const params = new URLSearchParams()
            if (options?.where) params.set('where', JSON.stringify(options.where))
            if (options?.orderBy) params.set('orderBy', JSON.stringify(options.orderBy))
            if (options?.limit) params.set('limit', options.limit.toString())
            if (options?.offset) params.set('offset', options.offset.toString())

            const queryString = params.toString()
            const response = await $fetch<{ data: T[] }>(
                `${apiBase}/${collection}${queryString ? `?${queryString}` : ''}`
            )
            return response.data
        },

        async findOne<T = any>(collection: string, options?: QueryOptions) {
            const results = await this.findMany<T>(collection, { ...options, limit: 1 })
            return results[0] || null
        },

        async update<T = any>(collection: string, id: string, data: Record<string, any>) {
            const response = await $fetch<{ data: T }>(`${apiBase}/${collection}/${id}`, {
                method: 'PATCH',
                body: data
            })
            return response.data
        },

        async delete(collection: string, id: string) {
            await $fetch(`${apiBase}/${collection}/${id}`, { method: 'DELETE' })
            return true
        },

        async count(collection: string, options?: QueryOptions) {
            const params = new URLSearchParams()
            if (options?.where) params.set('where', JSON.stringify(options.where))

            const queryString = params.toString()
            const response = await $fetch<{ count: number }>(
                `${apiBase}/${collection}/count${queryString ? `?${queryString}` : ''}`
            )
            return response.count
        }
    }
}
