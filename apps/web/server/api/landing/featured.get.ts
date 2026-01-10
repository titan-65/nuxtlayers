import { getDb } from '../../utils/firebase'

/**
 * Get landing page data: featured layers and stats.
 * GET /api/landing/featured
 */
export default defineEventHandler(async (event) => {
    const db = getDb()

    try {
        // Get featured/official layers sorted by downloads
        const layersSnapshot = await db
            .collection('layers')
            .where('official', '==', true)
            .orderBy('downloads', 'desc')
            .limit(6)
            .get()

        const featuredLayers = layersSnapshot.docs.map(doc => {
            const data = doc.data()
            return {
                id: data.name || data.id,
                tag: data.tags?.[0]?.toUpperCase() || 'LAYER',
                isNew: isRecentlyAdded(data.createdAt),
                description: data.description || '',
                downloads: formatDownloads(data.downloads || 0)
            }
        })

        // Get platform stats
        const totalLayersSnapshot = await db.collection('layers').count().get()
        const totalLayers = totalLayersSnapshot.data().count

        // Calculate total downloads
        const allLayersSnapshot = await db.collection('layers').get()
        const totalDownloads = allLayersSnapshot.docs.reduce((sum, doc) => {
            return sum + (doc.data().downloads || 0)
        }, 0)

        return {
            success: true,
            data: {
                featuredLayers,
                stats: {
                    totalLayers,
                    totalDownloads: formatDownloads(totalDownloads),
                    publishers: 1 // Placeholder for now
                }
            }
        }

    } catch (error: any) {
        console.error('Landing page error:', error)
        // Return fallback data on error
        return {
            success: true,
            data: {
                featuredLayers: [],
                stats: { totalLayers: 0, totalDownloads: '0', publishers: 0 }
            }
        }
    }
})

// Helper to check if layer was added in the last 30 days
function isRecentlyAdded(createdAt: string | undefined): boolean {
    if (!createdAt) return false
    const created = new Date(createdAt)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return created > thirtyDaysAgo
}

// Helper to format download counts
function formatDownloads(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
    return n.toString()
}
