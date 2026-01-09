/**
 * Payments composable for Stripe integration.
 */
export const usePayments = () => {
    const config = useRuntimeConfig()
    const loading = ref(false)

    const checkout = async (priceId: string, options?: { successUrl?: string; cancelUrl?: string }) => {
        loading.value = true
        try {
            const { url } = await $fetch('/api/payments/checkout', {
                method: 'POST',
                body: { priceId, ...options }
            })
            if (url) window.location.href = url
        } finally {
            loading.value = false
        }
    }

    const openPortal = async (customerId: string, returnUrl?: string) => {
        loading.value = true
        try {
            const { url } = await $fetch('/api/payments/portal', {
                method: 'POST',
                body: { customerId, returnUrl }
            })
            if (url) window.location.href = url
        } finally {
            loading.value = false
        }
    }

    return { loading, checkout, openPortal }
}
