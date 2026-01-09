// getDb is auto-imported from server/utils/firebase
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

    try {
        const decodedId = decodeURIComponent(id)

        // Increment download count
        await db.collection('layers').doc(decodedId).update({
            downloads: FieldValue.increment(1)
        })

        return {
            success: true
        }

    } catch (error: any) {
        // Don't fail if download tracking fails
        console.error('Track download error:', error)
        return {
            success: false
        }
    }
})
