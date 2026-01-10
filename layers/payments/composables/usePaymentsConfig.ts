/**
 * Payments configuration composable.
 * Access payments settings from runtime config.
 * 
 * @example
 * ```ts
 * const { provider, publishableKey, webhookPath } = usePaymentsConfig()
 * ```
 * 
 * Configure in nuxt.config.ts:
 * ```ts
 * runtimeConfig: {
 *   public: {
 *     payments: {
 *       provider: 'stripe', // 'stripe' | 'paddle' | 'lemonsqueezy'
 *       publishableKey: 'pk_test_...',
 *       portalEnabled: true,
 *       currency: 'usd',
 *       successUrl: '/payment/success',
 *       cancelUrl: '/payment/cancel'
 *     }
 *   },
 *   // Server-side only
 *   payments: {
 *     secretKey: 'sk_test_...',
 *     webhookSecret: 'whsec_...'
 *   }
 * }
 * ```
 */
export type PaymentProvider = 'stripe' | 'paddle' | 'lemonsqueezy'

export const usePaymentsConfig = () => {
    const config = useRuntimeConfig()

    const paymentsConfig = computed(() => ({
        provider: (config.public.payments?.provider || 'stripe') as PaymentProvider,
        publishableKey: config.public.payments?.publishableKey || '',
        portalEnabled: config.public.payments?.portalEnabled ?? true,
        currency: config.public.payments?.currency || 'usd',
        successUrl: config.public.payments?.successUrl || '/payment/success',
        cancelUrl: config.public.payments?.cancelUrl || '/payment/cancel',

        // Endpoints
        checkoutEndpoint: config.public.payments?.checkoutEndpoint || '/api/payments/checkout',
        portalEndpoint: config.public.payments?.portalEndpoint || '/api/payments/portal',
        webhookPath: config.public.payments?.webhookPath || '/api/payments/webhook'
    }))

    return {
        provider: computed(() => paymentsConfig.value.provider),
        publishableKey: computed(() => paymentsConfig.value.publishableKey),
        portalEnabled: computed(() => paymentsConfig.value.portalEnabled),
        currency: computed(() => paymentsConfig.value.currency),
        successUrl: computed(() => paymentsConfig.value.successUrl),
        cancelUrl: computed(() => paymentsConfig.value.cancelUrl),
        checkoutEndpoint: computed(() => paymentsConfig.value.checkoutEndpoint),
        portalEndpoint: computed(() => paymentsConfig.value.portalEndpoint),
        webhookPath: computed(() => paymentsConfig.value.webhookPath),
        config: paymentsConfig
    }
}
