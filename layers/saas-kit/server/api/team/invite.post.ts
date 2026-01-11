/**
 * Invite a member to a team
 * POST /api/team/invite
 */
import { getFirestore } from 'firebase-admin/firestore'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    try {
        const session = await getServerSession(event)
        if (!session?.user?.email) {
            throw createError({ statusCode: 401, message: 'Unauthorized' })
        }

        const body = await readBody(event)
        const { teamId, email, role = 'member' } = body

        if (!teamId || !email) {
            throw createError({ statusCode: 400, message: 'Team ID and email are required' })
        }

        if (!['admin', 'member'].includes(role)) {
            throw createError({ statusCode: 400, message: 'Invalid role' })
        }

        const db = getFirestore()

        // Verify user is owner or admin of the team
        const teamDoc = await db.collection('teams').doc(teamId).get()
        if (!teamDoc.exists) {
            throw createError({ statusCode: 404, message: 'Team not found' })
        }

        const team = teamDoc.data()
        const userEmail = session.user.email

        // Check permissions
        if (team?.ownerId !== userEmail) {
            const memberDoc = await db
                .collection('teams')
                .doc(teamId)
                .collection('members')
                .doc(userEmail)
                .get()

            if (!memberDoc.exists || memberDoc.data()?.role === 'member') {
                throw createError({ statusCode: 403, message: 'Only owners and admins can invite members' })
            }
        }

        // Check if member already exists
        const existingMember = await db
            .collection('teams')
            .doc(teamId)
            .collection('members')
            .doc(email)
            .get()

        if (existingMember.exists) {
            throw createError({ statusCode: 409, message: 'Member already exists' })
        }

        // Create invitation (for now, directly add as pending member)
        const inviteRef = db.collection('teams').doc(teamId).collection('invites').doc(email)
        await inviteRef.set({
            email,
            role,
            invitedBy: userEmail,
            invitedAt: new Date().toISOString(),
            status: 'pending'
        })

        // In a real app, you'd send an email here
        // For now, we'll auto-accept for demo purposes
        await db
            .collection('teams')
            .doc(teamId)
            .collection('members')
            .doc(email)
            .set({
                email,
                role,
                joinedAt: new Date().toISOString(),
                invitedBy: userEmail
            })

        // Update member count
        await db.collection('teams').doc(teamId).update({
            memberCount: (team?.memberCount || 1) + 1,
            updatedAt: new Date().toISOString()
        })

        return { success: true, message: 'Member invited successfully' }
    } catch (error: any) {
        console.error('Invite member error:', error)
        if (error.statusCode) throw error
        throw createError({ statusCode: 500, message: 'Failed to invite member' })
    }
})
