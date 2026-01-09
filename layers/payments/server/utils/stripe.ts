import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

/**
 * Get Stripe server instance.
 */
export function useStripe(): Stripe {
    if (!stripeInstance) {
        const config = useRuntimeConfig()
        stripeInstance = new Stripe(config.stripe.secretKey, {
            apiVersion: '2024-12-18.acacia'
        })
    }
    return stripeInstance
}
