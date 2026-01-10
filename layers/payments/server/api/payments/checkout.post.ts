import { usePolar } from '../../utils/polar'

/**
 * Create checkout session for Stripe or Polar.
 * POST /api/payments/checkout
 */
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const config = useRuntimeConfig()

    const {
        priceId,
        productId,
        plan,
        successUrl,
        cancelUrl,
        customerId,
        customerEmail,
        metadata
    } = body

    // Determine provider from body or config
    const provider = body.provider || config.public.payments?.provider || 'polar'

    // Build URLs
    const origin = getRequestURL(event).origin
    const defaultSuccessUrl = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`
    const defaultCancelUrl = `${origin}/checkout/cancel`

    if (provider === 'polar') {
        // ===== POLAR CHECKOUT =====
        const polar = usePolar()

        if (!polar) {
            throw createError({
                statusCode: 500,
                message: 'Polar not configured'
            })
        }

        // Get product ID from plan name or direct productId
        let polarProductId = productId
        if (!polarProductId && plan) {
            polarProductId = plan === 'pro'
                ? config.polar?.productPro
                : config.polar?.productTeam
        }

        if (!polarProductId) {
            throw createError({
                statusCode: 400,
                message: 'Product ID or plan required'
            })
        }

        try {
            const checkout = await polar.checkouts.create({
                productId: polarProductId,
                successUrl: successUrl || `${origin}/checkout/success`,
                customerEmail: customerEmail,
                metadata: {
                    ...metadata,
                    plan: plan || 'pro'
                }
            })

            return {
                sessionId: checkout.id,
                url: checkout.url,
                provider: 'polar'
            }
        } catch (error: any) {
            console.error('Polar checkout error:', error)
            throw createError({
                statusCode: 500,
                message: error.message || 'Failed to create Polar checkout'
            })
        }

    } else if (provider === 'stripe') {
        // ===== STRIPE CHECKOUT =====
        const stripe = useStripe()

        if (!stripe) {
            throw createError({
                statusCode: 500,
                message: 'Stripe not configured. Install stripe package and set STRIPE_SECRET_KEY.'
            })
        }

        if (!priceId) {
            throw createError({
                statusCode: 400,
                message: 'Price ID required for Stripe'
            })
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: successUrl || defaultSuccessUrl,
            cancel_url: cancelUrl || defaultCancelUrl,
            customer: customerId || undefined,
            customer_email: !customerId ? customerEmail : undefined,
            metadata: metadata || {}
        })

        return {
            sessionId: session.id,
            url: session.url,
            provider: 'stripe'
        }

    } else {
        throw createError({
            statusCode: 400,
            message: `Unknown provider: ${provider}`
        })
    }
})
