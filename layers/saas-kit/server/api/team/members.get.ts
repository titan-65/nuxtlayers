/**
 * Get team members
 * GET /api/team/members?teamId=xxx
 */
import { getFirestore } from 'firebase-admin/firestore'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    try {
        const session = await getServerSession(event)
        if (!session?.user?.email) {
            throw createError({ statusCode: 401, message: 'Unauthorized' })
        }

        const query = getQuery(event)
        const teamId = query.teamId as string

        if (!teamId) {
            throw createError({ statusCode: 400, message: 'Team ID is required' })
        }

        const db = getFirestore()

        // Verify user has access to this team
        const teamDoc = await db.collection('teams').doc(teamId).get()
        if (!teamDoc.exists) {
            throw createError({ statusCode: 404, message: 'Team not found' })
        }

        const team = teamDoc.data()
        const userEmail = session.user.email

        // Check if user is owner or member
        if (team?.ownerId !== userEmail) {
            const memberDoc = await db
                .collection('teams')
                .doc(teamId)
                .collection('members')
                .doc(userEmail)
                .get()

            if (!memberDoc.exists) {
                throw createError({ statusCode: 403, message: 'Access denied' })
            }
        }

        // Get all members
        const membersSnapshot = await db
            .collection('teams')
            .doc(teamId)
            .collection('members')
            .get()

        const members: any[] = []
        membersSnapshot.forEach(doc => {
            members.push({ id: doc.id, ...doc.data() })
        })

        return { success: true, members }
    } catch (error: any) {
        console.error('Get members error:', error)
        if (error.statusCode) throw error
        throw createError({ statusCode: 500, message: 'Failed to fetch members' })
    }
})
