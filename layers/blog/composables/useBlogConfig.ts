/**
 * Blog configuration composable.
 * Access blog settings from runtime config.
 * 
 * @example
 * ```ts
 * const { title, basePath, theme, postsPerPage } = useBlogConfig()
 * ```
 */
export const useBlogConfig = () => {
    const config = useRuntimeConfig()

    const blogConfig = computed(() => ({
        title: config.public.blog?.title || 'Blog',
        description: config.public.blog?.description || 'Latest posts and updates',
        basePath: config.public.blog?.basePath || '/blog',
        postsPerPage: config.public.blog?.postsPerPage || 10,
        authorName: config.public.blog?.authorName || 'Author',
        authorAvatar: config.public.blog?.authorAvatar || '',
        theme: config.public.blog?.theme || 'dark'
    }))

    return {
        title: computed(() => blogConfig.value.title),
        description: computed(() => blogConfig.value.description),
        basePath: computed(() => blogConfig.value.basePath),
        postsPerPage: computed(() => blogConfig.value.postsPerPage),
        authorName: computed(() => blogConfig.value.authorName),
        authorAvatar: computed(() => blogConfig.value.authorAvatar),
        theme: computed(() => blogConfig.value.theme),
        config: blogConfig
    }
}
