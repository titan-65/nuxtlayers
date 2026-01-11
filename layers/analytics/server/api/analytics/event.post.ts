/**
 * Track custom event
 * POST /api/analytics/event
 */
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { name, properties, timestamp } = body

        if (!name) {
            throw createError({ statusCode: 400, message: 'Event name is required' })
        }

        const db = getFirestore()
        const now = new Date()
        const dateKey = now.toISOString().split('T')[0]

        // Record event
        const eventRef = db.collection('analytics_events').doc()
        await eventRef.set({
            name,
            properties: properties || {},
            timestamp: timestamp || now.toISOString(),
            date: dateKey
        })

        // Update event aggregate
        const eventAggRef = db.collection('analytics_event_totals').doc(name)
        await eventAggRef.set({
            name,
            count: FieldValue.increment(1),
            lastTriggered: now.toISOString()
        }, { merge: true })

        return { success: true }
    } catch (error: any) {
        console.error('Track event error:', error)
        if (error.statusCode) throw error
        throw createError({ statusCode: 500, message: 'Failed to track event' })
    }
})
