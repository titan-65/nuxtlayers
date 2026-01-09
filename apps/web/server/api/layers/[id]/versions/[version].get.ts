// getDb is auto-imported from server/utils/firebase

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const version = getRouterParam(event, 'version')

    if (!id || !version) {
        throw createError({
            statusCode: 400,
            message: 'Layer ID and version are required'
        })
    }

    const db = getDb()

    try {
        const decodedId = decodeURIComponent(id)

        // Get layer doc
        const layerDoc = await db.collection('layers').doc(decodedId).get()

        if (!layerDoc.exists) {
            throw createError({
                statusCode: 404,
                message: `Layer "${decodedId}" not found`
            })
        }

        const layer = layerDoc.data()

        // Get specific version
        const versionDoc = await db
            .collection('layers')
            .doc(decodedId)
            .collection('versions')
            .doc(version)
            .get()

        if (!versionDoc.exists) {
            throw createError({
                statusCode: 404,
                message: `Version "${version}" not found for "${decodedId}"`
            })
        }

        const versionData = versionDoc.data()

        return {
            success: true,
            data: {
                name: decodedId,
                version: versionDoc.id,
                description: layer?.description,
                tarballUrl: versionData?.tarballUrl,
                changelog: versionData?.changelog,
                dependencies: layer?.dependencies || [],
                official: layer?.official || false,
                publishedAt: versionData?.publishedAt
            }
        }

    } catch (error: any) {
        if (error.statusCode) throw error

        console.error('Get version error:', error)
        throw createError({
            statusCode: 500,
            message: error.message || 'Failed to fetch version'
        })
    }
})
