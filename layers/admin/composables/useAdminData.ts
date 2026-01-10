import type { AdminCollections } from './useAdminConfig'

/**
 * Admin data entity interface.
 */
export interface AdminEntity {
    id: string
    [key: string]: any
}

/**
 * Admin data composable for CRUD operations.
 * Fetches data from Firestore or API based on configuration.
 * 
 * @example
 * ```ts
 * const { items, loading, create, update, remove } = useAdminData('users')
 * ```
 */
export const useAdminData = <T extends AdminEntity>(entityKey: keyof AdminCollections) => {
    const { dataSource, collections, apiBase, pageSize } = useAdminConfig()

    const items = ref<T[]>([])
    const loading = ref(true)
    const error = ref<string | null>(null)
    const totalCount = ref(0)

    const collectionName = computed(() => collections.value[entityKey] || entityKey)

    const fetchItems = async (options?: { page?: number; limit?: number }) => {
        loading.value = true
        error.value = null
        const limit = options?.limit || pageSize.value
        const page = options?.page || 1

        try {
            if (dataSource.value === 'firestore') {
                await fetchFromFirestore(limit, page)
            } else {
                await fetchFromApi(limit, page)
            }
        } catch (e: any) {
            console.error(`Failed to fetch ${String(entityKey)}:`, e)
            error.value = e.message || 'Failed to load data'
        } finally {
            loading.value = false
        }
    }

    const fetchFromFirestore = async (limit: number, page: number) => {
        const { data } = await useFetch(`/api/admin/${collectionName.value}`, {
            query: { limit, page }
        })
        if (data.value) {
            items.value = data.value.items || []
            totalCount.value = data.value.total || 0
        }
    }

    const fetchFromApi = async (limit: number, page: number) => {
        const { data } = await useFetch(`${apiBase.value}/${collectionName.value}`, {
            query: { limit, page }
        })
        if (data.value) {
            items.value = Array.isArray(data.value) ? data.value : data.value.items || []
            totalCount.value = data.value.total || items.value.length
        }
    }

    const create = async (item: Omit<T, 'id'>): Promise<T | null> => {
        try {
            const endpoint = dataSource.value === 'firestore'
                ? `/api/admin/${collectionName.value}`
                : `${apiBase.value}/${collectionName.value}`

            const response = await $fetch<T>(endpoint, {
                method: 'POST',
                body: item
            })

            if (response) {
                items.value = [...items.value, response]
                return response
            }
            return null
        } catch (e: any) {
            error.value = e.message || 'Failed to create'
            return null
        }
    }

    const update = async (id: string, updates: Partial<T>): Promise<boolean> => {
        try {
            const endpoint = dataSource.value === 'firestore'
                ? `/api/admin/${collectionName.value}/${id}`
                : `${apiBase.value}/${collectionName.value}/${id}`

            await $fetch(endpoint, {
                method: 'PATCH',
                body: updates
            })

            const index = items.value.findIndex(i => i.id === id)
            if (index >= 0) {
                items.value[index] = { ...items.value[index], ...updates }
            }
            return true
        } catch (e: any) {
            error.value = e.message || 'Failed to update'
            return false
        }
    }

    const remove = async (id: string): Promise<boolean> => {
        try {
            const endpoint = dataSource.value === 'firestore'
                ? `/api/admin/${collectionName.value}/${id}`
                : `${apiBase.value}/${collectionName.value}/${id}`

            await $fetch(endpoint, { method: 'DELETE' })

            items.value = items.value.filter(i => i.id !== id)
            return true
        } catch (e: any) {
            error.value = e.message || 'Failed to delete'
            return false
        }
    }

    // Fetch on mount
    onMounted(() => {
        fetchItems()
    })

    return {
        items: computed(() => items.value),
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        totalCount: computed(() => totalCount.value),
        refresh: fetchItems,
        create,
        update,
        remove
    }
}

/**
 * Admin stats composable for dashboard.
 */
export const useAdminStats = () => {
    const { dataSource, apiBase } = useAdminConfig()

    const stats = ref<Array<{ title: string; value: string | number; change?: number }>>([])
    const loading = ref(true)

    const fetchStats = async () => {
        loading.value = true
        try {
            const endpoint = dataSource.value === 'firestore'
                ? '/api/admin/stats'
                : `${apiBase.value}/stats`

            const { data } = await useFetch(endpoint)
            if (data.value?.stats) {
                stats.value = data.value.stats
            } else {
                // Fallback sample stats
                stats.value = [
                    { title: 'Total Users', value: '—', change: 0 },
                    { title: 'Total Layers', value: '—', change: 0 },
                    { title: 'Downloads', value: '—', change: 0 },
                    { title: 'Active Sessions', value: '—', change: 0 }
                ]
            }
        } catch (e) {
            console.error('Failed to fetch stats:', e)
            stats.value = [
                { title: 'Total Users', value: '—' },
                { title: 'Total Layers', value: '—' },
                { title: 'Downloads', value: '—' },
                { title: 'Active Sessions', value: '—' }
            ]
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        fetchStats()
    })

    return {
        stats: computed(() => stats.value),
        loading: computed(() => loading.value),
        refresh: fetchStats
    }
}
