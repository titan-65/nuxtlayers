/**
 * Admin configuration composable.
 * Access admin settings from runtime config.
 * 
 * @example
 * ```ts
 * const { dataSource, collections, apiBase } = useAdminConfig()
 * ```
 * 
 * Configure in nuxt.config.ts:
 * ```ts
 * runtimeConfig: {
 *   public: {
 *     admin: {
 *       dataSource: 'firestore', // 'firestore' | 'api'
 *       collections: {
 *         users: 'users',
 *         posts: 'posts',
 *         layers: 'layers'
 *       },
 *       apiBase: '/api/admin'
 *     }
 *   }
 * }
 * ```
 */
export type AdminDataSource = 'firestore' | 'api'

export interface AdminCollections {
    users: string
    posts: string
    layers: string
    [key: string]: string
}

export const useAdminConfig = () => {
    const config = useRuntimeConfig()

    const adminConfig = computed(() => ({
        dataSource: (config.public.admin?.dataSource || 'firestore') as AdminDataSource,
        collections: {
            users: config.public.admin?.collections?.users || 'users',
            posts: config.public.admin?.collections?.posts || 'posts',
            layers: config.public.admin?.collections?.layers || 'layers',
            ...config.public.admin?.collections
        } as AdminCollections,
        apiBase: config.public.admin?.apiBase || '/api/admin',
        pageSize: config.public.admin?.pageSize || 20
    }))

    return {
        dataSource: computed(() => adminConfig.value.dataSource),
        collections: computed(() => adminConfig.value.collections),
        apiBase: computed(() => adminConfig.value.apiBase),
        pageSize: computed(() => adminConfig.value.pageSize),
        config: adminConfig
    }
}
