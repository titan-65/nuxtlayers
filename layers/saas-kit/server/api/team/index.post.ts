/**
 * Create a new team
 * POST /api/team
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

        if (!body.name) {
            throw createError({ statusCode: 400, message: 'Team name is required' })
        }

        const db = getFirestore()

        // Generate slug from name if not provided
        const slug = body.slug || body.name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')

        // Check if slug is taken
        const existingTeam = await db
            .collection('teams')
            .where('slug', '==', slug)
            .limit(1)
            .get()

        if (!existingTeam.empty) {
            throw createError({ statusCode: 409, message: 'Team URL already taken' })
        }

        // Create team document
        const teamRef = db.collection('teams').doc()
        const team = {
            id: teamRef.id,
            name: body.name,
            slug,
            ownerId: session.user.email,
            plan: 'free',
            memberCount: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        await teamRef.set(team)

        // Add owner as first member
        await teamRef.collection('members').doc(session.user.email).set({
            email: session.user.email,
            name: session.user.name || '',
            role: 'owner',
            joinedAt: new Date().toISOString()
        })

        return { success: true, team }
    } catch (error: any) {
        console.error('Create team error:', error)
        if (error.statusCode) throw error
        throw createError({ statusCode: 500, message: 'Failed to create team' })
    }
})
