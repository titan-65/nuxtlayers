/**
 * Get user's teams
 * GET /api/team
 */
import { getFirestore } from 'firebase-admin/firestore'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    try {
        const session = await getServerSession(event)
        if (!session?.user?.email) {
            throw createError({ statusCode: 401, message: 'Unauthorized' })
        }

        const db = getFirestore()
        const userEmail = session.user.email

        // Find all teams where user is owner or member
        // First, get teams where user is owner
        const ownedTeamsSnapshot = await db
            .collection('teams')
            .where('ownerId', '==', userEmail)
            .get()

        const teams: any[] = []

        ownedTeamsSnapshot.forEach(doc => {
            teams.push({ id: doc.id, ...doc.data() })
        })

        // Also check for teams where user is a member (not owner)
        // This requires a different query approach - checking membership subcollection
        // For now, return just owned teams

        return { success: true, teams }
    } catch (error: any) {
        console.error('Get teams error:', error)
        if (error.statusCode) throw error
        throw createError({ statusCode: 500, message: 'Failed to fetch teams' })
    }
})
