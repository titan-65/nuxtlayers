/**
 * SaaS Subscription composable
 * Manages subscription state and billing status
 */

export interface Subscription {
    id: string
    status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete'
    plan: 'free' | 'pro' | 'team' | 'enterprise'
    priceId?: string
    currentPeriodEnd?: string
    trialEndsAt?: string
    cancelAtPeriodEnd?: boolean
}

export const useSaasSubscription = () => {
    const subscription = ref<Subscription>({
        id: '',
        status: 'trialing',
        plan: 'pro'
    })
    const loading = ref(false)
    const error = ref<string | null>(null)

    const config = useRuntimeConfig()
    const trialDays = computed(() => config.public.saasKit?.trialDays || 14)

    // Computed properties
    const isActive = computed(() =>
        ['active', 'trialing'].includes(subscription.value.status)
    )

    const isTrialing = computed(() =>
        subscription.value.status === 'trialing'
    )

    const isPro = computed(() =>
        subscription.value.plan === 'pro' || subscription.value.plan === 'team' || subscription.value.plan === 'enterprise'
    )

    const daysRemaining = computed(() => {
        if (!subscription.value.trialEndsAt) return trialDays.value
        const end = new Date(subscription.value.trialEndsAt)
        const now = new Date()
        const diff = end.getTime() - now.getTime()
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
    })

    const planLabel = computed(() => {
        const labels: Record<string, string> = {
            free: 'Free',
            pro: 'Pro',
            team: 'Team',
            enterprise: 'Enterprise'
        }
        return labels[subscription.value.plan] || 'Free'
    })

    // Fetch subscription status
    const fetchSubscription = async () => {
        loading.value = true
        error.value = null
        try {
            const response = await $fetch<{ success: boolean; subscription: Subscription }>('/api/subscription/status')
            if (response.success) {
                subscription.value = response.subscription
            }
        } catch (e: any) {
            error.value = e.message
            // Default to trial
            subscription.value = {
                id: 'demo',
                status: 'trialing',
                plan: 'pro',
                trialEndsAt: new Date(Date.now() + trialDays.value * 24 * 60 * 60 * 1000).toISOString()
            }
        } finally {
            loading.value = false
        }
    }

    // Upgrade to plan
    const upgrade = async (plan: 'pro' | 'team') => {
        navigateTo(`/checkout?plan=${plan}`)
    }

    // Open billing portal
    const openBillingPortal = async () => {
        try {
            const response = await $fetch<{ url: string }>('/api/payments/portal', {
                method: 'POST'
            })
            if (response.url) {
                window.location.href = response.url
            }
        } catch (e: any) {
            error.value = e.message || 'Failed to open billing portal'
        }
    }

    return {
        subscription,
        loading,
        error,
        isActive,
        isTrialing,
        isPro,
        daysRemaining,
        planLabel,
        fetchSubscription,
        upgrade,
        openBillingPortal
    }
}
