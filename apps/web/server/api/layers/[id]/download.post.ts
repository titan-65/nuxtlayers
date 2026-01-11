/**
 * Download Layer API
 * 
 * For FREE layers: Returns public tarball URL
 * For PREMIUM layers: Validates license, then returns signed URL
 * 
 * POST /api/layers/[id]/download
 * Body: { licenseKey?: string }
 */
import { getDb } from '~~/server/utils/firebase'
import { getStorage } from 'firebase-admin/storage'
import { FieldValue } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'Layer ID is required'
        })
    }

    const db = getDb()
    const body = await readBody(event).catch(() => ({}))
    const licenseKey = body?.licenseKey

    try {
        const decodedId = decodeURIComponent(id)
        const sanitizedId = decodedId.replace('@', '').replace('/', '-')

        // Fetch layer metadata
        const layerDoc = await db.collection('layers').doc(sanitizedId).get()

        if (!layerDoc.exists) {
            throw createError({
                statusCode: 404,
                message: 'Layer not found'
            })
        }

        const layer = layerDoc.data()!
        const isPremium = layer.premium === true

        // Get latest version
        const versionsSnap = await db
            .collection('layers')
            .doc(sanitizedId)
            .collection('versions')
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get()

        if (versionsSnap.empty) {
            throw createError({
                statusCode: 404,
                message: 'No versions available'
            })
        }

        const versionDoc = versionsSnap.docs[0]
        const version = versionDoc.data()

        // For PREMIUM layers, validate license
        if (isPremium) {
            if (!licenseKey) {
                throw createError({
                    statusCode: 401,
                    message: 'License key required for premium layers. Get one at https://nuxtlayers.dev/pricing'
                })
            }

            // Validate the license
            const licenseSnap = await db
                .collection('licenses')
                .where('key', '==', licenseKey)
                .limit(1)
                .get()

            if (licenseSnap.empty) {
                throw createError({
                    statusCode: 403,
                    message: 'Invalid license key'
                })
            }

            const license = licenseSnap.docs[0].data()

            // Check license validity
            if (license.status !== 'active') {
                throw createError({
                    statusCode: 403,
                    message: 'License is not active'
                })
            }

            // Check expiration
            if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
                throw createError({
                    statusCode: 403,
                    message: 'License has expired'
                })
            }

            // Check if layer is covered by the license
            const coveredLayers = license.layers || []
            if (coveredLayers.length > 0 && !coveredLayers.includes(decodedId) && !coveredLayers.includes('*')) {
                throw createError({
                    statusCode: 403,
                    message: 'License does not cover this layer'
                })
            }

            // For premium layers, generate a signed URL (expires in 1 hour)
            const bucket = getStorage().bucket()
            const tarballName = version.tarballUrl?.split('/').pop() || `vantol-${sanitizedId}-${versionDoc.id}.tgz`
            const file = bucket.file(`layers/${tarballName}`)

            const [signedUrl] = await file.getSignedUrl({
                action: 'read',
                expires: Date.now() + 60 * 60 * 1000 // 1 hour
            })

            // Track download
            await db.collection('layers').doc(sanitizedId).update({
                downloads: FieldValue.increment(1)
            })

            // Log license usage
            await db.collection('license_usage').add({
                licenseId: licenseSnap.docs[0].id,
                licenseKey: licenseKey.substring(0, 8) + '...',
                layerId: decodedId,
                action: 'download',
                timestamp: new Date().toISOString()
            })

            return {
                success: true,
                premium: true,
                layer: decodedId,
                version: versionDoc.id,
                downloadUrl: signedUrl,
                expiresIn: '1 hour'
            }
        }

        // For FREE layers, return public URL directly
        await db.collection('layers').doc(sanitizedId).update({
            downloads: FieldValue.increment(1)
        })

        return {
            success: true,
            premium: false,
            layer: decodedId,
            version: versionDoc.id,
            downloadUrl: version.tarballUrl
        }

    } catch (error: any) {
        console.error('Download error:', error)
        if (error.statusCode) throw error
        throw createError({
            statusCode: 500,
            message: 'Failed to process download'
        })
    }
})
