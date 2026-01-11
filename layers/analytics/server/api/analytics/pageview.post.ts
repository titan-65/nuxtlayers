/**
 * Track page view
 * POST /api/analytics/pageview
 */
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { createHash } from 'node:crypto'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { path, referrer, timestamp } = body

        if (!path) {
            throw createError({ statusCode: 400, message: 'Path is required' })
        }

        // Get visitor info from headers (privacy-focused, no cookies)
        const headers = getHeaders(event)
        const userAgent = headers['user-agent'] || ''
        const ip = headers['x-forwarded-for'] || headers['x-real-ip'] || 'unknown'

        // Create anonymous visitor ID from IP + User Agent hash
        const visitorHash = createHash('sha256')
            .update(`${ip}:${userAgent}`)
            .digest('hex')
            .substring(0, 16)

        const db = getFirestore()
        const now = new Date()
        const dateKey = now.toISOString().split('T')[0] // YYYY-MM-DD

        // Record page view
        const pageViewRef = db.collection('analytics_pageviews').doc()
        await pageViewRef.set({
            path,
            referrer: referrer || null,
            visitorHash,
            userAgent: userAgent.substring(0, 200), // Truncate for storage
            timestamp: timestamp || now.toISOString(),
            date: dateKey
        })

        // Update daily aggregate
        const dailyRef = db.collection('analytics_daily').doc(dateKey)
        await dailyRef.set({
            date: dateKey,
            pageViews: FieldValue.increment(1),
            updatedAt: now.toISOString()
        }, { merge: true })

        // Update page stats
        // Use encodeURIComponent to ensure valid document ID if path contains special chars
        // But firestore doc IDs can contain most chars. Slashing is main concern.
        const safePathId = encodeURIComponent(path).replace(/\./g, '%2E')

        const pageRef = db.collection('analytics_pages').doc(safePathId)
        await pageRef.set({
            path,
            views: FieldValue.increment(1),
            lastViewed: now.toISOString()
        }, { merge: true })

        return { success: true }
    } catch (error: any) {
        console.error('Track pageview error:', error)
        if (error.statusCode) throw error
        throw createError({ statusCode: 500, message: 'Failed to track page view' })
    }
})
