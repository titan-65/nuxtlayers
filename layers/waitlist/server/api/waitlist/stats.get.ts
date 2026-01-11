/**
 * Get waitlist stats
 * GET /api/waitlist/stats
 */
import { getFirestore } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
    const db = getFirestore()

    try {
        const countSnapshot = await db.collection('waitlist').count().get()
        const totalSignups = countSnapshot.data().count

        // Get top referrers
        const topReferrers = await db.collection('waitlist')
            .orderBy('referralCount', 'desc')
            .limit(5)
            .get()

        const leaderboard = topReferrers.docs.map((doc, index) => {
            const data = doc.data()
            return {
                position: index + 1,
                email: data.email.replace(/(.{2}).*(@.*)/, '$1***$2'),
                referralCount: data.referralCount || 0
            }
        })

        return {
            success: true,
            data: {
                totalSignups,
                leaderboard
            }
        }

    } catch (error: any) {
        console.error('Waitlist stats error:', error)
        throw createError({ statusCode: 500, message: 'Failed to get stats' })
    }
})
