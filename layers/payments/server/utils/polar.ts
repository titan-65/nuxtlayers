import { Polar } from '@polar-sh/sdk'

let polarClient: Polar | null = null

/**
 * Get or create Polar SDK instance.
 * Uses runtime config for access token.
 */
export const usePolar = () => {
    if (polarClient) return polarClient

    const config = useRuntimeConfig()
    const accessToken = config.polar?.accessToken

    if (!accessToken) {
        console.warn('[@vantol/payments] Polar access token not configured')
        return null
    }

    polarClient = new Polar({
        accessToken,
        server: config.polar?.sandbox ? 'sandbox' : 'production'
    })

    return polarClient
}

/**
 * Verify Polar webhook signature.
 */
export const verifyPolarWebhook = (payload: string, signature: string, secret: string): boolean => {
    // Polar uses HMAC-SHA256 for webhook signatures
    const crypto = require('crypto')
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(payload)
    const expectedSignature = hmac.digest('hex')
    return signature === expectedSignature
}
