let stripeInstance: any | null = null

/**
 * Get Stripe server instance.
 * Returns null if Stripe is not configured.
 */
export function useStripe(): any | null {
    const config = useRuntimeConfig()

    // Only initialize if Stripe is configured
    if (!config.stripe?.secretKey) {
        return null
    }

    if (!stripeInstance) {
        try {
            // Dynamic import to avoid error when stripe package is not installed
            const Stripe = require('stripe').default || require('stripe')
            stripeInstance = new Stripe(config.stripe.secretKey, {
                apiVersion: '2024-12-18.acacia'
            })
        } catch (error) {
            console.warn('[@vantol/payments] Stripe package not installed. Stripe payments disabled.')
            return null
        }
    }
    return stripeInstance
}
