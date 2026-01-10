/**
 * Blog configuration composable.
 * Access blog settings from runtime config.
 * 
 * @example
 * ```ts
 * const { title, basePath, theme, dataSource } = useBlogConfig()
 * ```
 * 
 * Configure in nuxt.config.ts:
 * ```ts
 * runtimeConfig: {
 *   public: {
 *     blog: {
 *       title: 'My Blog',
 *       dataSource: 'firestore', // 'firestore' | 'content' | 'api' | 'static'
 *       collection: 'posts',
 *       apiEndpoint: '/api/posts'
 *     }
 *   }
 * }
 * ```
 */
export type BlogDataSource = 'firestore' | 'content' | 'api' | 'static'

export const useBlogConfig = () => {
    const config = useRuntimeConfig()

    const blogConfig = computed(() => ({
        // Display settings
        title: config.public.blog?.title || 'Blog',
        description: config.public.blog?.description || 'Latest posts and updates',
        basePath: config.public.blog?.basePath || '/blog',
        postsPerPage: config.public.blog?.postsPerPage || 10,
        authorName: config.public.blog?.authorName || 'Author',
        authorAvatar: config.public.blog?.authorAvatar || '',
        theme: config.public.blog?.theme || 'dark',

        // Data source settings
        dataSource: (config.public.blog?.dataSource || 'static') as BlogDataSource,
        collection: config.public.blog?.collection || 'posts',
        apiEndpoint: config.public.blog?.apiEndpoint || '/api/posts',
        contentPath: config.public.blog?.contentPath || '/blog'
    }))

    return {
        // Display
        title: computed(() => blogConfig.value.title),
        description: computed(() => blogConfig.value.description),
        basePath: computed(() => blogConfig.value.basePath),
        postsPerPage: computed(() => blogConfig.value.postsPerPage),
        authorName: computed(() => blogConfig.value.authorName),
        authorAvatar: computed(() => blogConfig.value.authorAvatar),
        theme: computed(() => blogConfig.value.theme),

        // Data source
        dataSource: computed(() => blogConfig.value.dataSource),
        collection: computed(() => blogConfig.value.collection),
        apiEndpoint: computed(() => blogConfig.value.apiEndpoint),
        contentPath: computed(() => blogConfig.value.contentPath),

        config: blogConfig
    }
}

