// getDb is auto-imported from server/utils/firebase

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const { q = '' } = query as Record<string, string>

    if (!q || q.length < 2) {
        return {
            success: true,
            data: { layers: [] }
        }
    }

    const db = getDb()

    try {
        // Get all layers and filter client-side
        // In production, use Algolia or Typesense for better search
        const snapshot = await db
            .collection('layers')
            .orderBy('downloads', 'desc')
            .limit(50)
            .get()

        const searchLower = q.toLowerCase()

        const layers = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter(layer =>
                layer.id?.toLowerCase().includes(searchLower) ||
                layer.name?.toLowerCase().includes(searchLower) ||
                layer.description?.toLowerCase().includes(searchLower) ||
                layer.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
            )
            .slice(0, 20)

        return {
            success: true,
            data: { layers }
        }

    } catch (error: any) {
        console.error('Search layers error:', error)
        throw createError({
            statusCode: 500,
            message: 'Search failed'
        })
    }
})
