// getDb, getStorageBucket are auto-imported from server/utils/firebase

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

        // Get layer doc to check it exists
        const layerDoc = await db.collection('layers').doc(decodedId).get()

        if (!layerDoc.exists) {
            throw createError({
                statusCode: 404,
                message: `Layer "${decodedId}" not found`
            })
        }

        const layer = layerDoc.data()

        // Get latest version from versions subcollection
        const versionsSnapshot = await db
            .collection('layers')
            .doc(decodedId)
            .collection('versions')
            .orderBy('publishedAt', 'desc')
            .limit(1)
            .get()

        if (versionsSnapshot.empty) {
            throw createError({
                statusCode: 404,
                message: `No versions found for "${decodedId}"`
            })
        }

        const latestVersion = versionsSnapshot.docs[0]
        const versionData = latestVersion.data()

        return {
            success: true,
            data: {
                name: decodedId,
                version: latestVersion.id,
                description: layer?.description,
                tarballUrl: versionData.tarballUrl,
                dependencies: layer?.dependencies || [],
                official: layer?.official || false,
                downloads: layer?.downloads || 0
            }
        }

    } catch (error: any) {
        if (error.statusCode) throw error

        console.error('Get latest version error:', error)
        throw createError({
            statusCode: 500,
            message: error.message || 'Failed to fetch latest version'
        })
    }
})
