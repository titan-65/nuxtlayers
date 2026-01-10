import type { BlogDataSource } from './useBlogConfig'

/**
 * Blog post interface.
 */
export interface BlogPost {
    slug: string
    title: string
    excerpt?: string
    content?: string
    date: string
    tags?: string[]
    readTime?: string
    author?: {
        name: string
        avatar?: string
    }
    image?: string
}

/**
 * Fetch blog posts from configured data source.
 * Supports Firestore, Nuxt Content, external API, or static data.
 * 
 * @example
 * ```ts
 * const { posts, loading, error, refresh } = useBlogPosts()
 * ```
 */
export const useBlogPosts = () => {
    const { dataSource, collection, apiEndpoint, contentPath, postsPerPage } = useBlogConfig()

    const posts = ref<BlogPost[]>([])
    const loading = ref(true)
    const error = ref<string | null>(null)

    const fetchPosts = async () => {
        loading.value = true
        error.value = null

        try {
            switch (dataSource.value) {
                case 'firestore':
                    await fetchFromFirestore()
                    break
                case 'content':
                    await fetchFromContent()
                    break
                case 'api':
                    await fetchFromApi()
                    break
                case 'static':
                default:
                    loadStaticPosts()
                    break
            }
        } catch (e: any) {
            console.error('Failed to fetch posts:', e)
            error.value = e.message || 'Failed to load posts'
            // Fallback to static in development
            if (import.meta.dev) {
                loadStaticPosts()
            }
        } finally {
            loading.value = false
        }
    }

    // Firestore fetching
    const fetchFromFirestore = async () => {
        const { data } = await useFetch(`/api/blog/posts`, {
            query: { collection: collection.value, limit: postsPerPage.value }
        })
        if (data.value?.posts) {
            posts.value = data.value.posts
        }
    }

    // Nuxt Content fetching
    const fetchFromContent = async () => {
        const { data } = await useAsyncData('blog-posts', () =>
            queryContent(contentPath.value)
                .sort({ date: -1 })
                .limit(postsPerPage.value)
                .find()
        )
        if (data.value) {
            posts.value = data.value.map((doc: any) => ({
                slug: doc._path?.split('/').pop() || doc.slug,
                title: doc.title,
                excerpt: doc.description || doc.excerpt,
                date: formatDate(doc.date),
                tags: doc.tags || [],
                readTime: doc.readTime || calculateReadTime(doc.body),
                author: doc.author,
                image: doc.img || doc.image
            }))
        }
    }

    // External API fetching
    const fetchFromApi = async () => {
        const { data } = await useFetch(apiEndpoint.value)
        if (data.value) {
            posts.value = Array.isArray(data.value) ? data.value : data.value.posts || []
        }
    }

    // Static sample posts for development
    const loadStaticPosts = () => {
        posts.value = [
            {
                slug: 'introducing-nuxtlayers',
                title: 'Introducing NuxtLayers',
                excerpt: 'Install production-ready features in your Nuxt app with a single command.',
                date: 'Jan 8, 2026',
                tags: ['announcement', 'release'],
                readTime: '3 min read'
            },
            {
                slug: 'building-nuxt-layers',
                title: 'Building Reusable Nuxt Layers',
                excerpt: 'Learn how to create, publish, and share your own Nuxt layers.',
                date: 'Jan 5, 2026',
                tags: ['tutorial', 'guide'],
                readTime: '8 min read'
            },
            {
                slug: 'auth-made-simple',
                title: 'Authentication Made Simple',
                excerpt: 'Add Firebase, Clerk, or Better Auth to your Nuxt app in under 5 minutes.',
                date: 'Jan 3, 2026',
                tags: ['auth', 'firebase'],
                readTime: '5 min read'
            }
        ]
    }

    // Helper functions
    const formatDate = (date: string | Date): string => {
        if (!date) return ''
        const d = new Date(date)
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    const calculateReadTime = (body: any): string => {
        if (!body) return '5 min read'
        const text = typeof body === 'string' ? body : JSON.stringify(body)
        const words = text.split(/\s+/).length
        const minutes = Math.ceil(words / 200)
        return `${minutes} min read`
    }

    // Fetch on mount
    onMounted(() => {
        fetchPosts()
    })

    return {
        posts: computed(() => posts.value),
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        refresh: fetchPosts
    }
}

/**
 * Fetch a single blog post by slug.
 */
export const useBlogPost = (slug: string | Ref<string>) => {
    const { dataSource, collection, apiEndpoint, contentPath } = useBlogConfig()

    const post = ref<BlogPost | null>(null)
    const loading = ref(true)
    const error = ref<string | null>(null)

    const slugValue = computed(() => typeof slug === 'string' ? slug : slug.value)

    const fetchPost = async () => {
        loading.value = true
        error.value = null

        try {
            switch (dataSource.value) {
                case 'firestore':
                    await fetchFromFirestore()
                    break
                case 'content':
                    await fetchFromContent()
                    break
                case 'api':
                    await fetchFromApi()
                    break
                case 'static':
                default:
                    loadStaticPost()
                    break
            }
        } catch (e: any) {
            console.error('Failed to fetch post:', e)
            error.value = e.message || 'Failed to load post'
        } finally {
            loading.value = false
        }
    }

    const fetchFromFirestore = async () => {
        const { data } = await useFetch(`/api/blog/posts/${slugValue.value}`, {
            query: { collection: collection.value }
        })
        if (data.value) {
            post.value = data.value as BlogPost
        }
    }

    const fetchFromContent = async () => {
        const { data } = await useAsyncData(`post-${slugValue.value}`, () =>
            queryContent(`${contentPath.value}/${slugValue.value}`).findOne()
        )
        if (data.value) {
            const doc = data.value
            post.value = {
                slug: slugValue.value,
                title: doc.title,
                excerpt: doc.description,
                content: doc.body,
                date: doc.date,
                tags: doc.tags,
                readTime: doc.readTime,
                author: doc.author,
                image: doc.img || doc.image
            }
        }
    }

    const fetchFromApi = async () => {
        const { data } = await useFetch(`${apiEndpoint.value}/${slugValue.value}`)
        if (data.value) {
            post.value = data.value as BlogPost
        }
    }

    const loadStaticPost = () => {
        // Sample post for development
        post.value = {
            slug: slugValue.value,
            title: slugValue.value.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            excerpt: 'This is a sample post for development.',
            content: '# Sample Post\n\nThis is sample content. Configure `dataSource` in your nuxt.config.ts to fetch real data.',
            date: 'Jan 1, 2026',
            tags: ['sample'],
            readTime: '2 min read'
        }
    }

    // Watch slug changes
    watch(slugValue, () => {
        fetchPost()
    }, { immediate: true })

    return {
        post: computed(() => post.value),
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        refresh: fetchPost
    }
}
