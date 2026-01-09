import { FieldValue } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Validate required fields
    if (!body.manifest || !body.tarball) {
        throw createError({
            statusCode: 400,
            message: 'manifest and tarball are required'
        })
    }

    const { manifest, tarball, changelog } = body
    const { name, version, description, tags, dependencies, demo, repository } = manifest

    if (!name || !version) {
        throw createError({
            statusCode: 400,
            message: 'manifest.name and manifest.version are required'
        })
    }

    // Validate layer name format (@org/name)
    if (!name.match(/^@[\w-]+\/[\w-]+$/)) {
        throw createError({
            statusCode: 400,
            message: 'Layer name must be in format @org/name'
        })
    }

    const db = getDb()
    const bucket = getStorageBucket()

    try {
        const layerRef = db.collection('layers').doc(name)
        const versionRef = layerRef.collection('versions').doc(version)

        // Check if this version already exists
        const existingVersion = await versionRef.get()
        if (existingVersion.exists) {
            throw createError({
                statusCode: 409,
                message: `Version ${version} already exists for ${name}`
            })
        }

        // Upload tarball to Cloud Storage
        const tarballBuffer = Buffer.from(tarball, 'base64')
        const tarballPath = `layers/${name.replace('@', '').replace('/', '-')}/${version}.tgz`
        const file = bucket.file(tarballPath)

        await file.save(tarballBuffer, {
            metadata: {
                contentType: 'application/gzip'
            }
        })

        // Make file publicly readable
        await file.makePublic()
        const tarballUrl = `https://storage.googleapis.com/${bucket.name}/${tarballPath}`

        const now = FieldValue.serverTimestamp()

        // Check if layer exists
        const layerDoc = await layerRef.get()

        if (layerDoc.exists) {
            // Update layer with new version info
            await layerRef.update({
                version,
                updatedAt: now
            })
        } else {
            // Create new layer
            await layerRef.set({
                name,
                description: description || '',
                tags: tags || [],
                dependencies: dependencies || [],
                demo: demo || null,
                repository: repository || null,
                version,
                downloads: 0,
                stars: 0,
                official: false,
                author: {
                    id: 'anonymous', // TODO: Get from auth
                    name: 'Anonymous'
                },
                publishedAt: now,
                updatedAt: now
            })
        }

        // Create version document
        await versionRef.set({
            tarballUrl,
            changelog: changelog || '',
            size: tarballBuffer.length,
            publishedAt: now
        })

        return {
            success: true,
            data: {
                name,
                version,
                tarballUrl
            }
        }

    } catch (error: any) {
        if (error.statusCode) throw error

        console.error('Publish layer error:', error)
        throw createError({
            statusCode: 500,
            message: error.message || 'Failed to publish layer'
        })
    }
})
