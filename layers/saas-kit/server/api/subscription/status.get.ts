/**
 * Get subscription status
 * GET /api/subscription/status
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

        // Get user's primary team to check subscription
        const teamsSnapshot = await db
            .collection('teams')
            .where('ownerId', '==', userEmail)
            .limit(1)
            .get()

        if (teamsSnapshot.empty) {
            // No team, return default free plan
            return {
                success: true,
                subscription: {
                    id: '',
                    status: 'active',
                    plan: 'free'
                }
            }
        }

        const team = teamsSnapshot.docs[0].data()
        const teamId = teamsSnapshot.docs[0].id

        // Check for subscription in subscriptions collection
        const subSnapshot = await db
            .collection('subscriptions')
            .where('teamId', '==', teamId)
            .where('status', 'in', ['active', 'trialing'])
            .limit(1)
            .get()

        if (subSnapshot.empty) {
            // Check if team has a trial
            const trialEndsAt = team.trialEndsAt
            if (trialEndsAt && new Date(trialEndsAt) > new Date()) {
                return {
                    success: true,
                    subscription: {
                        id: 'trial',
                        status: 'trialing',
                        plan: team.plan || 'pro',
                        trialEndsAt
                    }
                }
            }

            // No subscription, return free plan
            return {
                success: true,
                subscription: {
                    id: '',
                    status: 'active',
                    plan: 'free'
                }
            }
        }

        const subscription = subSnapshot.docs[0].data()
        return {
            success: true,
            subscription: {
                id: subscription.id,
                status: subscription.status,
                plan: subscription.plan,
                currentPeriodEnd: subscription.currentPeriodEnd,
                cancelAtPeriodEnd: subscription.cancelAtPeriodEnd
            }
        }
    } catch (error: any) {
        console.error('Get subscription error:', error)
        if (error.statusCode) throw error
        throw createError({ statusCode: 500, message: 'Failed to fetch subscription' })
    }
})
