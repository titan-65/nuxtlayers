import fs from 'fs-extra'
import path from 'path'
import os from 'os'
import * as tar from 'tar'

// Default to localhost for development, override with env var for production
const REGISTRY_URL = process.env.NUXTLAYERS_REGISTRY || 'http://localhost:3001'

// License key can be set via env var or passed to functions
let storedLicenseKey: string | undefined = process.env.NUXTLAYERS_LICENSE

export interface Layer {
    id?: string
    name: string
    version: string
    description: string
    tarballUrl: string
    dependencies?: string[]
    official?: boolean
    premium?: boolean
    downloads?: number
    tags?: string[]
}

export interface LayerSearchResult {
    layers: Layer[]
}

export interface LayerResponse {
    success: boolean
    data: Layer
}

export interface DownloadResponse {
    success: boolean
    premium: boolean
    layer: string
    version: string
    downloadUrl: string
    expiresIn?: string
    message?: string
}

export function setLicenseKey(key: string): void {
    storedLicenseKey = key
}

export function getLicenseKey(): string | undefined {
    return storedLicenseKey
}

export async function fetchLayer(name: string, version?: string): Promise<Layer | null> {
    try {
        // Normalize layer name - ensure it starts with @
        const normalizedName = name.startsWith('@') ? name : `@vantol/${name}`

        const endpoint = version
            ? `/api/layers/${encodeURIComponent(normalizedName)}/versions/${version}`
            : `/api/layers/${encodeURIComponent(normalizedName)}/latest`

        const url = `${REGISTRY_URL}${endpoint}`

        console.log(`Fetching from: ${url}`)

        const response = await fetch(url)

        if (!response.ok) {
            if (response.status === 404) {
                return null
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const json = await response.json() as LayerResponse

        if (!json.success) {
            return null
        }

        return json.data
    } catch (error) {
        throw new Error(`Failed to fetch layer: ${error}`)
    }
}

export async function searchRegistry(query: string): Promise<Layer[]> {
    try {
        const url = `${REGISTRY_URL}/api/layers/search?q=${encodeURIComponent(query)}`
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Registry search failed: HTTP ${response.status}`)
        }

        const json = await response.json()

        if (!json.success) {
            return []
        }

        return json.data?.layers || []
    } catch (error) {
        throw new Error(`Search failed: ${error}`)
    }
}

/**
 * Request download URL for a layer.
 * For premium layers, this validates the license and returns a signed URL.
 */
export async function requestDownload(layerName: string, licenseKey?: string): Promise<DownloadResponse> {
    const url = `${REGISTRY_URL}/api/layers/${encodeURIComponent(layerName)}/download`

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            licenseKey: licenseKey || storedLicenseKey
        })
    })

    const json = await response.json() as DownloadResponse

    if (!response.ok) {
        const errorMessage = (json as any).message || `HTTP ${response.status}`
        throw new Error(errorMessage)
    }

    return json
}

export async function downloadLayer(tarballUrl: string): Promise<string> {
    try {
        console.log(`Downloading from: ${tarballUrl}`)

        const response = await fetch(tarballUrl)

        if (!response.ok) {
            throw new Error(`Failed to download layer: HTTP ${response.status}`)
        }

        const buffer = await response.arrayBuffer()
        const tempPath = path.join(os.tmpdir(), `nuxtlayer-${Date.now()}.tgz`)

        await fs.writeFile(tempPath, Buffer.from(buffer))

        return tempPath
    } catch (error) {
        throw new Error(`Download failed: ${error}`)
    }
}

/**
 * Download a layer with license validation for premium layers.
 */
export async function downloadLayerWithLicense(
    layerName: string,
    licenseKey?: string
): Promise<{ tarballPath: string; version: string }> {
    // First, request the download (validates license for premium)
    const downloadInfo = await requestDownload(layerName, licenseKey)

    if (!downloadInfo.success) {
        throw new Error('Download request failed')
    }

    if (downloadInfo.premium) {
        console.log(`🔐 Premium layer - license validated`)
    }

    // Download the tarball
    const tarballPath = await downloadLayer(downloadInfo.downloadUrl)

    return {
        tarballPath,
        version: downloadInfo.version
    }
}

export async function extractLayer(tarballPath: string, destPath: string): Promise<void> {
    // Ensure destination exists
    await fs.ensureDir(destPath)

    // Extract tarball
    await tar.extract({
        file: tarballPath,
        cwd: destPath,
        strip: 1 // Remove the top-level directory from the archive
    })

    // Clean up temp file
    await fs.remove(tarballPath)
}

export function getRegistryUrl(): string {
    return REGISTRY_URL
}
