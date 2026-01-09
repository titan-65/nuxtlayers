#!/usr/bin/env node

/**
 * Script to package layers as tarballs and upload to Firebase Storage.
 * 
 * Usage:
 *   node scripts/upload-layers.js
 * 
 * Requires:
 *   - FIREBASE_SERVICE_ACCOUNT env var or GOOGLE_APPLICATION_CREDENTIALS
 *   - Firebase Storage bucket configured
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'
import { getFirestore } from 'firebase-admin/firestore'
import * as tar from 'tar'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration - Use default bucket format: {projectId}.appspot.com
const STORAGE_BUCKET = 'layers-854b4.appspot.com'
const LAYERS_DIR = path.join(__dirname, '..', 'layers')
const TEMP_DIR = path.join(__dirname, '..', '.tmp-tarballs')

// Layer IDs to package
const LAYER_IDS = [
    'auth-firebase',
    'auth-clerk',
    'auth-better',
    'blog',
    'admin',
    'payments',
    'landing'
]

async function initFirebase() {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT

    if (!serviceAccount) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is required')
    }

    initializeApp({
        credential: cert(JSON.parse(serviceAccount)),
        storageBucket: STORAGE_BUCKET
    })

    return {
        storage: getStorage().bucket(),
        db: getFirestore()
    }
}

async function packageLayer(layerId) {
    const layerPath = path.join(LAYERS_DIR, layerId)
    const layerJsonPath = path.join(layerPath, 'layer.json')

    if (!await fs.pathExists(layerPath)) {
        console.log(`  ⚠ Layer directory not found: ${layerId}`)
        return null
    }

    // Read layer.json for version
    let version = '1.0.0'
    if (await fs.pathExists(layerJsonPath)) {
        const layerJson = await fs.readJson(layerJsonPath)
        version = layerJson.version || '1.0.0'
    }

    // Create temp directory
    await fs.ensureDir(TEMP_DIR)

    // Create tarball
    const tarballName = `vantol-${layerId}-${version}.tgz`
    const tarballPath = path.join(TEMP_DIR, tarballName)

    await tar.create(
        {
            gzip: true,
            file: tarballPath,
            cwd: LAYERS_DIR
        },
        [layerId]
    )

    const stats = await fs.stat(tarballPath)
    console.log(`  ✓ Packaged: ${tarballName} (${(stats.size / 1024).toFixed(1)} KB)`)

    return {
        layerId,
        version,
        tarballPath,
        tarballName
    }
}

async function uploadLayer(bucket, db, layerInfo) {
    const { layerId, version, tarballPath, tarballName } = layerInfo

    // Upload to Firebase Storage
    const destination = `layers/${tarballName}`
    await bucket.upload(tarballPath, {
        destination,
        metadata: {
            contentType: 'application/gzip',
            metadata: {
                layerId: `@vantol/${layerId}`,
                version
            }
        }
    })

    // Make public
    await bucket.file(destination).makePublic()

    const publicUrl = `https://storage.googleapis.com/${STORAGE_BUCKET}/${destination}`
    console.log(`  ✓ Uploaded: ${publicUrl}`)

    // Update Firestore with tarball URL
    const docId = `vantol-${layerId}`
    const versionRef = db.collection('layers').doc(docId).collection('versions').doc(version)

    await versionRef.update({
        tarballUrl: publicUrl
    })
    console.log(`  ✓ Updated Firestore: ${docId}/versions/${version}`)

    return publicUrl
}

async function main() {
    console.log('📦 NuxtLayers Tarball Upload Script\n')

    try {
        // Initialize Firebase
        console.log('Initializing Firebase...')
        const { storage, db } = await initFirebase()
        console.log('✓ Firebase initialized\n')

        // Package and upload each layer
        console.log('Packaging layers...')
        const results = []

        for (const layerId of LAYER_IDS) {
            console.log(`\n[${layerId}]`)

            const layerInfo = await packageLayer(layerId)
            if (!layerInfo) continue

            const url = await uploadLayer(storage, db, layerInfo)
            results.push({ layerId, url })
        }

        // Cleanup
        await fs.remove(TEMP_DIR)

        // Summary
        console.log('\n' + '='.repeat(50))
        console.log(`✅ Successfully uploaded ${results.length} layers`)
        console.log('='.repeat(50))

        for (const result of results) {
            console.log(`  @vantol/${result.layerId}`)
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message)
        process.exit(1)
    }
}

main()
