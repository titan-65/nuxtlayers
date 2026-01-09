// getDb is auto-imported from server/utils/firebase

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const db = getDb()

    const {
        q = '',
        tags = '',
        official,
        sort = 'downloads',
        order = 'desc',
        page = 1,
        pageSize = 20
    } = query as Record<string, string>

    try {
        let layersRef = db.collection('layers')
        let firestoreQuery: FirebaseFirestore.Query = layersRef

        // Filter by official status
        if (official !== undefined) {
            firestoreQuery = firestoreQuery.where('official', '==', official === 'true')
        }

        // Filter by tags (if provided)
        if (tags) {
            const tagArray = tags.split(',').map(t => t.trim())
            firestoreQuery = firestoreQuery.where('tags', 'array-contains-any', tagArray)
        }

        // Sorting
        const sortField = ['downloads', 'stars', 'updatedAt', 'name'].includes(sort) ? sort : 'downloads'
        const sortOrder = order === 'asc' ? 'asc' : 'desc'
        firestoreQuery = firestoreQuery.orderBy(sortField, sortOrder)

        // Pagination
        const pageNum = parseInt(page) || 1
        const limit = Math.min(parseInt(pageSize) || 20, 100)
        const offset = (pageNum - 1) * limit

        firestoreQuery = firestoreQuery.offset(offset).limit(limit)

        const snapshot = await firestoreQuery.get()

        const layers = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        // Text search filter (client-side for now)
        let filteredLayers = layers
        if (q) {
            const searchLower = q.toLowerCase()
            filteredLayers = layers.filter(layer =>
                layer.name?.toLowerCase().includes(searchLower) ||
                layer.description?.toLowerCase().includes(searchLower) ||
                layer.id?.toLowerCase().includes(searchLower)
            )
        }

        // Get total count for pagination
        const countSnapshot = await layersRef.count().get()
        const total = countSnapshot.data().count

        return {
            success: true,
            data: {
                layers: filteredLayers,
                total,
                page: pageNum,
                pageSize: limit,
                hasMore: offset + filteredLayers.length < total
            }
        }

    } catch (error: any) {
        console.error('List layers error:', error)
        throw createError({
            statusCode: 500,
            message: error.message || 'Failed to fetch layers'
        })
    }
})
