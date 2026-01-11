/**
 * Join the waitlist
 * POST /api/waitlist/join
 */
import { getFirestore } from 'firebase-admin/firestore'
import crypto from 'crypto'

interface JoinRequest {
    email: string
    referredBy?: string
}

export default defineEventHandler(async (event) => {
    const body = await readBody<JoinRequest>(event)

    if (!body.email) {
        throw createError({ statusCode: 400, message: 'Email is required' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
        throw createError({ statusCode: 400, message: 'Invalid email format' })
    }

    const db = getFirestore()
    const email = body.email.toLowerCase().trim()

    try {
        // Check if already signed up
        const existing = await db.collection('waitlist')
            .where('email', '==', email)
            .get()

        if (!existing.empty) {
            const existingData = existing.docs[0].data()
            return {
                success: true,
                data: {
                    email: existingData.email,
                    referralCode: existingData.referralCode,
                    position: existingData.position,
                    referralCount: existingData.referralCount || 0,
                    createdAt: existingData.createdAt
                }
            }
        }

        // Generate unique referral code
        const referralCode = crypto.randomBytes(4).toString('hex').toUpperCase()

        // Get current position (total count + 1)
        const countSnapshot = await db.collection('waitlist').count().get()
        const position = countSnapshot.data().count + 1

        // Create waitlist entry
        const entryData = {
            email,
            referralCode,
            referredBy: body.referredBy || null,
            position,
            referralCount: 0,
            createdAt: new Date().toISOString()
        }

        await db.collection('waitlist').add(entryData)

        // If referred, increment referrer's count
        if (body.referredBy) {
            const referrerSnapshot = await db.collection('waitlist')
                .where('referralCode', '==', body.referredBy)
                .get()

            if (!referrerSnapshot.empty) {
                const referrerDoc = referrerSnapshot.docs[0]
                await referrerDoc.ref.update({
                    referralCount: (referrerDoc.data().referralCount || 0) + 1
                })
            }
        }

        return {
            success: true,
            data: entryData
        }

    } catch (error: any) {
        console.error('Waitlist join error:', error)
        throw createError({ statusCode: 500, message: 'Failed to join waitlist' })
    }
})
