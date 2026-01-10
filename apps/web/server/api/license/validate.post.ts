import { getDb } from '../../utils/firebase'

interface LicenseValidation {
    licenseKey: string
    layerId: string
    domain?: string
}

/**
 * Validate a license key for a specific layer.
 * POST /api/license/validate
 */
export default defineEventHandler(async (event) => {
    const body = await readBody<LicenseValidation>(event)

    if (!body.licenseKey) {
        throw createError({
            statusCode: 400,
            message: 'License key is required'
        })
    }

    if (!body.layerId) {
        throw createError({
            statusCode: 400,
            message: 'Layer ID is required'
        })
    }

    const db = getDb()

    try {
        // Find license by key
        const licensesSnapshot = await db
            .collection('licenses')
            .where('key', '==', body.licenseKey)
            .limit(1)
            .get()

        if (licensesSnapshot.empty) {
            return {
                valid: false,
                error: 'Invalid license key'
            }
        }

        const licenseDoc = licensesSnapshot.docs[0]
        const license = licenseDoc.data()

        // Check if license is active
        if (license.status !== 'active') {
            return {
                valid: false,
                error: `License is ${license.status}`
            }
        }

        // Check expiration
        if (license.expiresAt) {
            const expiresAt = new Date(license.expiresAt)
            if (expiresAt < new Date()) {
                // Update status to expired
                await licenseDoc.ref.update({ status: 'expired' })
                return {
                    valid: false,
                    error: 'License has expired'
                }
            }
        }

        // Check if license covers this layer
        const layers = license.layers || []
        if (layers !== '*' && !layers.includes(body.layerId) && !layers.includes('*')) {
            return {
                valid: false,
                error: 'License does not cover this layer'
            }
        }

        // Check domain restriction (optional)
        if (body.domain && license.domains && license.domains.length > 0) {
            const domainAllowed = license.domains.some((allowed: string) => {
                if (allowed.startsWith('*.')) {
                    // Wildcard subdomain match
                    const baseDomain = allowed.slice(2)
                    return body.domain === baseDomain || body.domain!.endsWith(`.${baseDomain}`)
                }
                return body.domain === allowed
            })

            if (!domainAllowed) {
                return {
                    valid: false,
                    error: 'License is not valid for this domain'
                }
            }
        }

        // License is valid!
        return {
            valid: true,
            plan: license.plan,
            features: license.features || [],
            expiresAt: license.expiresAt,
            layerId: body.layerId
        }

    } catch (error: any) {
        console.error('License validation error:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to validate license'
        })
    }
})
