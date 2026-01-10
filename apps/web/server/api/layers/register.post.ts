import { getDb } from '../../utils/firebase'

/**
 * Register a new layer in the registry (GitHub-based distribution).
 * POST /api/layers/register
 * 
 * Body: {
 *   name: string,           // e.g. "@vantol/my-layer"
 *   description: string,
 *   version: string,        // e.g. "1.0.0"
 *   tags: string[],
 *   githubUrl: string,      // GitHub repo URL (e.g. "github:user/repo/layers/name")
 *   readme?: string,
 *   author: { name: string, email: string }
 * }
 */
export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Validate required fields
    if (!body.name || !body.description || !body.version || !body.githubUrl || !body.author?.email) {
        throw createError({
            statusCode: 400,
            message: 'Missing required fields: name, description, version, githubUrl, author.email'
        })
    }

    // Validate name format
    if (!body.name.match(/^@[\w-]+\/[\w-]+$/)) {
        throw createError({
            statusCode: 400,
            message: 'Layer name must be in format @org/name'
        })
    }

    const db = getDb()

    try {
        // Create document ID from name
        const docId = body.name.replace('@', '').replace('/', '-')

        // Check if layer already exists
        const existingDoc = await db.collection('layers').doc(docId).get()

        if (existingDoc.exists) {
            throw createError({
                statusCode: 409,
                message: 'A layer with this name already exists. Use update instead.'
            })
        }

        // Create layer document
        const now = new Date().toISOString()
        const layerData = {
            name: body.name,
            description: body.description,
            version: body.version,
            tags: body.tags || [],
            githubUrl: body.githubUrl,
            readme: body.readme || '',
            author: {
                name: body.author.name || 'Unknown',
                email: body.author.email
            },
            downloads: 0,
            official: false,
            createdAt: now,
            updatedAt: now
        }

        await db.collection('layers').doc(docId).set(layerData)

        // Create initial version in subcollection
        await db.collection('layers').doc(docId).collection('versions').doc(body.version).set({
            version: body.version,
            githubUrl: body.githubUrl,
            createdAt: now,
            changelog: body.changelog || 'Initial release'
        })

        return {
            success: true,
            message: `Layer ${body.name} registered successfully!`,
            data: {
                id: docId,
                name: body.name,
                version: body.version,
                githubUrl: body.githubUrl
            }
        }

    } catch (error: any) {
        if (error.statusCode) throw error

        console.error('Register layer error:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to register layer'
        })
    }
})
