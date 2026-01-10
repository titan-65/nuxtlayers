import { verifyPolarWebhook } from '../../utils/polar'

/**
 * Handle Polar webhook events.
 * POST /api/payments/webhook
 * 
 * Events handled:
 * - checkout.created
 * - checkout.updated (completed)
 * - subscription.created
 * - subscription.updated
 */
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    // Get raw body for signature verification
    const rawBody = await readRawBody(event)
    if (!rawBody) {
        throw createError({ statusCode: 400, message: 'Missing request body' })
    }

    // Verify webhook signature
    const signature = getHeader(event, 'polar-signature') || getHeader(event, 'x-polar-signature')

    if (config.polar?.webhookSecret && signature) {
        const isValid = verifyPolarWebhook(rawBody, signature, config.polar.webhookSecret)
        if (!isValid) {
            console.warn('Invalid Polar webhook signature')
            throw createError({ statusCode: 401, message: 'Invalid signature' })
        }
    }

    // Parse the webhook payload
    const payload = JSON.parse(rawBody)
    const { type, data } = payload

    console.log(`[Polar Webhook] Received event: ${type}`)

    try {
        switch (type) {
            case 'checkout.updated':
                // Check if checkout is completed
                if (data.status === 'succeeded') {
                    await handleCheckoutCompleted(data, config)
                }
                break

            case 'subscription.created':
                await handleSubscriptionCreated(data, config)
                break

            case 'subscription.updated':
                await handleSubscriptionUpdated(data, config)
                break

            case 'subscription.canceled':
                await handleSubscriptionCanceled(data, config)
                break

            default:
                console.log(`[Polar Webhook] Unhandled event type: ${type}`)
        }

        return { received: true }

    } catch (error: any) {
        console.error('[Polar Webhook] Error processing event:', error)
        throw createError({
            statusCode: 500,
            message: 'Webhook processing failed'
        })
    }
})

/**
 * Handle successful checkout - generate license key
 */
async function handleCheckoutCompleted(checkout: any, config: any) {
    console.log('[Polar] Checkout completed:', checkout.id)

    const customerEmail = checkout.customer_email || checkout.customer?.email
    const plan = checkout.metadata?.plan || 'pro'

    if (!customerEmail) {
        console.error('[Polar] No customer email in checkout')
        return
    }

    // Call license generation API
    try {
        const licenseResponse = await $fetch('/api/license/generate', {
            method: 'POST',
            headers: {
                'x-admin-key': config.adminApiKey || 'dev-admin-key'
            },
            body: {
                userId: checkout.customer_id || checkout.id,
                email: customerEmail,
                plan: plan,
                layers: plan === 'enterprise' ? '*' : ['@vantol/payments', '@vantol/analytics'],
                expiresInDays: 365
            }
        })

        console.log('[Polar] License generated:', licenseResponse)

        // TODO: Send email with license key to customer

    } catch (error) {
        console.error('[Polar] Failed to generate license:', error)
    }
}

/**
 * Handle new subscription
 */
async function handleSubscriptionCreated(subscription: any, config: any) {
    console.log('[Polar] Subscription created:', subscription.id)
    // Additional logic for subscription tracking
}

/**
 * Handle subscription update
 */
async function handleSubscriptionUpdated(subscription: any, config: any) {
    console.log('[Polar] Subscription updated:', subscription.id, subscription.status)
    // Handle upgrade/downgrade
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCanceled(subscription: any, config: any) {
    console.log('[Polar] Subscription canceled:', subscription.id)
    // Revoke license or mark as expiring
}
