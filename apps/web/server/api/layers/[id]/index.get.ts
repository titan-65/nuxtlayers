// getDb is auto-imported from server/utils/firebase

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
        // Decode the layer ID (e.g., @vantol/blog -> @vantol%2Fblog)
        const decodedId = decodeURIComponent(id)

        const doc = await db.collection('layers').doc(decodedId).get()

        if (!doc.exists) {
            throw createError({
                statusCode: 404,
                message: `Layer "${decodedId}" not found`
            })
        }

        const layer = {
            id: doc.id,
            ...doc.data()
        }

        // Get versions subcollection
        const versionsSnapshot = await db
            .collection('layers')
            .doc(decodedId)
            .collection('versions')
            .orderBy('publishedAt', 'desc')
            .limit(10)
            .get()

        const versions = versionsSnapshot.docs.map(vDoc => ({
            version: vDoc.id,
            ...vDoc.data()
        }))

        return {
            success: true,
            data: {
                ...layer,
                versions
            }
        }

    } catch (error: any) {
        if (error.statusCode) throw error

        console.error('Get layer error:', error)
        throw createError({
            statusCode: 500,
            message: error.message || 'Failed to fetch layer'
        })
    }
})
