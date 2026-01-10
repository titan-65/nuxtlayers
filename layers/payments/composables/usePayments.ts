/**
 * Payments composable for checkout and billing portal.
 * Uses configured provider endpoints.
 */
export const usePayments = () => {
    const {
        checkoutEndpoint,
        portalEndpoint,
        successUrl,
        cancelUrl,
        provider
    } = usePaymentsConfig()

    const loading = ref(false)
    const error = ref<string | null>(null)

    const checkout = async (priceId: string, options?: {
        successUrl?: string
        cancelUrl?: string
        metadata?: Record<string, string>
    }) => {
        loading.value = true
        error.value = null

        try {
            const response = await $fetch<{ url: string }>(checkoutEndpoint.value, {
                method: 'POST',
                body: {
                    priceId,
                    provider: provider.value,
                    successUrl: options?.successUrl || successUrl.value,
                    cancelUrl: options?.cancelUrl || cancelUrl.value,
                    metadata: options?.metadata
                }
            })
            if (response?.url) {
                window.location.href = response.url
            }
        } catch (e: any) {
            error.value = e.message || 'Checkout failed'
            console.error('Checkout error:', e)
        } finally {
            loading.value = false
        }
    }

    const openPortal = async (customerId: string, returnUrl?: string) => {
        loading.value = true
        error.value = null

        try {
            const response = await $fetch<{ url: string }>(portalEndpoint.value, {
                method: 'POST',
                body: {
                    customerId,
                    provider: provider.value,
                    returnUrl: returnUrl || window.location.href
                }
            })
            if (response?.url) {
                window.location.href = response.url
            }
        } catch (e: any) {
            error.value = e.message || 'Portal failed'
            console.error('Portal error:', e)
        } finally {
            loading.value = false
        }
    }

    return {
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        checkout,
        openPortal,
        provider
    }
}

