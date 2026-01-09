/**
 * Create Stripe customer portal session.
 */
export default defineEventHandler(async (event) => {
    const stripe = useStripe()
    const body = await readBody(event)

    const { customerId, returnUrl } = body

    if (!customerId) {
        throw createError({ statusCode: 400, message: 'Customer ID required' })
    }

    const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl || `${getRequestURL(event).origin}/account`
    })

    return { url: session.url }
})
