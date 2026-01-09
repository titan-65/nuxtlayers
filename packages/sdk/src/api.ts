/**
 * API response types
 */

export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
}

export interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    pageSize: number
    hasMore: boolean
}

export interface SearchParams {
    query?: string
    tags?: string[]
    official?: boolean
    sort?: 'downloads' | 'stars' | 'updated' | 'name'
    order?: 'asc' | 'desc'
    page?: number
    pageSize?: number
}

export interface PublishRequest {
    /** Layer manifest */
    manifest: {
        name: string
        version: string
        description: string
        tags: string[]
        dependencies?: string[]
        demo?: string
        repository?: string
    }
    /** Base64 encoded tarball */
    tarball: string
    /** Changelog for this version */
    changelog?: string
}
