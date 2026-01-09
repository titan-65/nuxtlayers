/**
 * Layer metadata stored in the registry
 */
export interface Layer {
    /** Unique identifier, e.g. "@vantol/blog" */
    id: string
    /** Display name, e.g. "Blog Layer" */
    name: string
    /** Short description */
    description: string
    /** Current version */
    version: string
    /** Author information */
    author: {
        id: string
        name: string
        avatar?: string
        website?: string
    }
    /** Searchable tags */
    tags: string[]
    /** Total downloads */
    downloads: number
    /** Star/like count */
    stars: number
    /** README content in Markdown */
    readme: string
    /** GitHub repository URL */
    repository?: string
    /** Live demo URL */
    demo?: string
    /** npm dependencies required */
    dependencies: string[]
    /** Peer dependencies */
    peerDependencies: Record<string, string>
    /** Is this an official layer? */
    official: boolean
    /** Published timestamp */
    publishedAt: Date
    /** Last updated timestamp */
    updatedAt: Date
}

/**
 * Layer version stored in the registry
 */
export interface LayerVersion {
    /** Version string, e.g. "1.2.0" */
    version: string
    /** Changelog for this version */
    changelog: string
    /** URL to download the tarball */
    tarballUrl: string
    /** File size in bytes */
    size: number
    /** SHA256 checksum */
    checksum: string
    /** Published timestamp */
    publishedAt: Date
}

/**
 * Local layer.json metadata file
 */
export interface LayerManifest {
    /** Layer identifier */
    name: string
    /** Version */
    version: string
    /** Description */
    description: string
    /** Tags */
    tags: string[]
    /** npm dependencies */
    dependencies?: string[]
    /** Demo URL */
    demo?: string
    /** Repository URL */
    repository?: string
}

/**
 * Installed layer in nuxt-layers.lock.json
 */
export interface InstalledLayer {
    /** Layer identifier */
    name: string
    /** Installed version */
    version: string
    /** Local path */
    path: string
    /** Install timestamp */
    installedAt: Date
}

export * from './api'
