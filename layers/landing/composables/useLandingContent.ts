import type { LandingFeature, LandingTestimonial } from './useLandingConfig'

/**
 * Landing content composable.
 * Fetches features, testimonials, and other content from configured source.
 */
export const useLandingContent = () => {
    const { dataSource, collection, apiEndpoint, hero } = useLandingConfig()

    const features = ref<LandingFeature[]>([])
    const testimonials = ref<LandingTestimonial[]>([])
    const loading = ref(true)
    const error = ref<string | null>(null)

    const fetchContent = async () => {
        loading.value = true
        error.value = null

        try {
            switch (dataSource.value) {
                case 'firestore':
                    await fetchFromFirestore()
                    break
                case 'api':
                    await fetchFromApi()
                    break
                case 'static':
                default:
                    loadStaticContent()
                    break
            }
        } catch (e: any) {
            console.error('Failed to fetch landing content:', e)
            error.value = e.message || 'Failed to load content'
            // Fallback to static
            loadStaticContent()
        } finally {
            loading.value = false
        }
    }

    const fetchFromFirestore = async () => {
        const { data } = await useFetch(`/api/landing/content`, {
            query: { collection: collection.value }
        })
        if (data.value) {
            features.value = data.value.features || []
            testimonials.value = data.value.testimonials || []
        }
    }

    const fetchFromApi = async () => {
        const { data } = await useFetch(apiEndpoint.value)
        if (data.value) {
            features.value = data.value.features || []
            testimonials.value = data.value.testimonials || []
        }
    }

    const loadStaticContent = () => {
        features.value = [
            {
                title: 'One-Command Install',
                description: 'Add any layer with npx nuxt-layers add',
                icon: '⚡'
            },
            {
                title: 'Production Ready',
                description: 'Battle-tested code used by thousands of apps',
                icon: '🚀'
            },
            {
                title: 'Fully Customizable',
                description: 'Override any component or composable',
                icon: '🎨'
            },
            {
                title: 'TypeScript First',
                description: 'Full type safety out of the box',
                icon: '📦'
            }
        ]

        testimonials.value = [
            {
                quote: 'NuxtLayers saved us weeks of development time.',
                author: 'Sarah Chen',
                role: 'Lead Developer'
            },
            {
                quote: 'The auth layer just works. No configuration hell.',
                author: 'Marcus Johnson',
                role: 'Startup Founder'
            }
        ]
    }

    // Fetch on mount
    onMounted(() => {
        fetchContent()
    })

    return {
        hero,
        features: computed(() => features.value),
        testimonials: computed(() => testimonials.value),
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        refresh: fetchContent
    }
}
