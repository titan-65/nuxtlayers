import { getDb } from '../../utils/firebase'

/**
 * Get user's licenses.
 * GET /api/license
 */
export default defineEventHandler(async (event) => {
    // Get user from Firebase auth token (simplified - in production use proper auth middleware)
    const authHeader = getHeader(event, 'authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw createError({
            statusCode: 401,
            message: 'Authentication required'
        })
    }

    // In production, verify Firebase ID token here
    // For now, we'll use email from query for demo
    const query = getQuery(event)
    const email = query.email as string

    if (!email) {
        throw createError({
            statusCode: 400,
            message: 'Email parameter required'
        })
    }

    const db = getDb()

    try {
        const licensesSnapshot = await db
            .collection('licenses')
            .where('email', '==', email)
            .orderBy('createdAt', 'desc')
            .get()

        const licenses = licensesSnapshot.docs.map(doc => {
            const data = doc.data()
            return {
                id: doc.id,
                key: maskLicenseKey(data.key),
                plan: data.plan,
                layers: data.layers,
                status: data.status,
                expiresAt: data.expiresAt,
                createdAt: data.createdAt
            }
        })

        return {
            success: true,
            licenses
        }

    } catch (error: any) {
        console.error('Get licenses error:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch licenses'
        })
    }
})

// Mask license key for display (show only last 4 chars)
function maskLicenseKey(key: string): string {
    if (!key || key.length < 8) return key
    return `NL-****-****-${key.slice(-4)}`
}
