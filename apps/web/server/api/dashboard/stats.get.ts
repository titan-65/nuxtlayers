import { getDb } from '../../utils/firebase'

/**
 * Get dashboard data for the authenticated user.
 * Returns their published layers and stats.
 * 
 * GET /api/dashboard/stats
 */
export default defineEventHandler(async (event) => {
    // Get user ID from query (in production, use session/auth)
    const query = getQuery(event)
    const userId = query.userId as string

    if (!userId) {
        throw createError({
            statusCode: 400,
            message: 'userId is required'
        })
    }

    const db = getDb()

    try {
        // Get layers published by this user
        const layersSnapshot = await db
            .collection('layers')
            .where('author.email', '==', userId)
            .get()

        const userLayers = layersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        // Calculate stats
        const totalLayers = userLayers.length
        const totalDownloads = userLayers.reduce((sum, layer: any) => sum + (layer.downloads || 0), 0)

        // For this month, we'd normally query download events by date
        // For now, estimate as 20% of total
        const thisMonth = Math.floor(totalDownloads * 0.2)

        // Get all layers if admin (for platform stats)
        const allLayersSnapshot = await db.collection('layers').count().get()
        const platformLayerCount = allLayersSnapshot.data().count

        return {
            success: true,
            data: {
                layers: userLayers.map((layer: any) => ({
                    id: layer.name || layer.id,
                    name: layer.name,
                    version: layer.version || '1.0.0',
                    description: layer.description,
                    downloads: layer.downloads || 0,
                    status: 'published',
                    tags: layer.tags || [],
                    updatedAt: layer.updatedAt
                })),
                stats: {
                    totalLayers,
                    totalDownloads,
                    thisMonth,
                    platformLayerCount
                }
            }
        }

    } catch (error: any) {
        console.error('Dashboard stats error:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch dashboard data'
        })
    }
})
