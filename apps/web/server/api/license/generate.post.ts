import { getDb } from '../../utils/firebase'
import crypto from 'crypto'

interface GenerateLicenseRequest {
    userId: string
    email: string
    plan: 'pro' | 'team' | 'enterprise'
    layers: string[] | '*'
    domains?: string[]
    expiresInDays?: number
}

/**
 * Generate a new license key (admin only).
 * POST /api/license/generate
 */
export default defineEventHandler(async (event) => {
    const body = await readBody<GenerateLicenseRequest>(event)

    // TODO: Add proper admin authentication
    // For now, we'll check for admin email in auth header or require API key
    const authHeader = getHeader(event, 'x-admin-key')
    const config = useRuntimeConfig()

    // Simple admin key check (in production, use proper auth)
    if (authHeader !== config.adminApiKey && authHeader !== 'dev-admin-key') {
        throw createError({
            statusCode: 403,
            message: 'Admin access required'
        })
    }

    if (!body.userId || !body.email || !body.plan) {
        throw createError({
            statusCode: 400,
            message: 'userId, email, and plan are required'
        })
    }

    const db = getDb()

    try {
        // Generate unique license key: NL-XXXX-XXXX-XXXX
        const generateKey = () => {
            const segment = () => crypto.randomBytes(2).toString('hex').toUpperCase()
            return `NL-${segment()}-${segment()}-${segment()}`
        }

        let key = generateKey()

        // Ensure key is unique
        let attempts = 0
        while (attempts < 5) {
            const existing = await db.collection('licenses').where('key', '==', key).get()
            if (existing.empty) break
            key = generateKey()
            attempts++
        }

        // Calculate expiration
        const now = new Date()
        const expiresAt = body.expiresInDays
            ? new Date(now.getTime() + body.expiresInDays * 24 * 60 * 60 * 1000)
            : new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) // Default 1 year

        // Create license document
        const licenseData = {
            key,
            userId: body.userId,
            email: body.email,
            plan: body.plan,
            layers: body.layers || '*',
            domains: body.domains || [],
            features: getPlanFeatures(body.plan),
            createdAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
            status: 'active'
        }

        const docRef = await db.collection('licenses').add(licenseData)

        return {
            success: true,
            license: {
                id: docRef.id,
                key,
                plan: body.plan,
                expiresAt: expiresAt.toISOString()
            }
        }

    } catch (error: any) {
        console.error('License generation error:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to generate license'
        })
    }
})

function getPlanFeatures(plan: string): string[] {
    switch (plan) {
        case 'pro':
            return ['premium-layers', 'priority-support', 'analytics']
        case 'team':
            return ['premium-layers', 'priority-support', 'analytics', 'team-management', 'white-label']
        case 'enterprise':
            return ['premium-layers', 'priority-support', 'analytics', 'team-management', 'white-label', 'custom-integrations', 'sla']
        default:
            return ['premium-layers']
    }
}
