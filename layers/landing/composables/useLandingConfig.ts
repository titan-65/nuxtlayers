/**
 * Landing page configuration composable.
 * Access landing settings from runtime config.
 * 
 * @example
 * ```ts
 * const { dataSource, heroTitle, features } = useLandingConfig()
 * ```
 * 
 * Configure in nuxt.config.ts:
 * ```ts
 * runtimeConfig: {
 *   public: {
 *     landing: {
 *       dataSource: 'static', // 'static' | 'firestore' | 'api'
 *       collection: 'landing-content',
 *       apiEndpoint: '/api/landing',
 *       // Static content (used when dataSource is 'static')
 *       hero: {
 *         title: 'Your Amazing Product',
 *         subtitle: 'The best solution for your needs',
 *         cta: { text: 'Get Started', href: '/signup' }
 *       }
 *     }
 *   }
 * }
 * ```
 */
export type LandingDataSource = 'static' | 'firestore' | 'api'

export interface LandingHero {
    title: string
    subtitle: string
    cta: { text: string; href: string }
    secondaryCta?: { text: string; href: string }
    image?: string
}

export interface LandingFeature {
    title: string
    description: string
    icon?: string
}

export interface LandingTestimonial {
    quote: string
    author: string
    role?: string
    avatar?: string
}

export const useLandingConfig = () => {
    const config = useRuntimeConfig()

    const landingConfig = computed(() => ({
        dataSource: (config.public.landing?.dataSource || 'static') as LandingDataSource,
        collection: config.public.landing?.collection || 'landing-content',
        apiEndpoint: config.public.landing?.apiEndpoint || '/api/landing',

        // Static hero content
        hero: {
            title: config.public.landing?.hero?.title || 'Build Faster with Nuxt Layers',
            subtitle: config.public.landing?.hero?.subtitle || 'Pre-built features you can install with a single command',
            cta: config.public.landing?.hero?.cta || { text: 'Get Started', href: '/docs' },
            secondaryCta: config.public.landing?.hero?.secondaryCta,
            image: config.public.landing?.hero?.image
        } as LandingHero
    }))

    return {
        dataSource: computed(() => landingConfig.value.dataSource),
        collection: computed(() => landingConfig.value.collection),
        apiEndpoint: computed(() => landingConfig.value.apiEndpoint),
        hero: computed(() => landingConfig.value.hero),
        config: landingConfig
    }
}
