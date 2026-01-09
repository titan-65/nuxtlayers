/**
 * Create Stripe checkout session.
 */
export default defineEventHandler(async (event) => {
    const stripe = useStripe()
    const body = await readBody(event)

    const { priceId, successUrl, cancelUrl, customerId, metadata } = body

    if (!priceId) {
        throw createError({ statusCode: 400, message: 'Price ID required' })
    }

    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: successUrl || `${getRequestURL(event).origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${getRequestURL(event).origin}/checkout/cancel`,
        customer: customerId || undefined,
        metadata: metadata || {}
    })

    return { sessionId: session.id, url: session.url }
})
