import { ref as dbRef, onValue, runTransaction, off } from 'firebase/database'
import type { Database, DatabaseReference, Unsubscribe } from 'firebase/database'

const SESSION_KEY = 'blog:viewedPosts'

function getViewedPosts(): Set<string> {
    if (import.meta.server) return new Set()
    try {
        const stored = sessionStorage.getItem(SESSION_KEY)
        return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
        return new Set()
    }
}

function markPostViewed(slug: string): void {
    if (import.meta.server) return
    try {
        const viewed = getViewedPosts()
        viewed.add(slug)
        sessionStorage.setItem(SESSION_KEY, JSON.stringify([...viewed]))
    } catch {
        // Ignore storage errors
    }
}

function hasViewedPost(slug: string): boolean {
    return getViewedPosts().has(slug)
}

/**
 * Track real-time view counts for blog posts using Firebase Realtime Database.
 * 
 * @example
 * ```ts
 * const { views, loading, init, trackView, cleanup } = useRealtimeViews('my-post-slug')
 * 
 * onMounted(() => {
 *   init()
 *   trackView() // Increment view count once per session
 * })
 * 
 * onUnmounted(() => cleanup())
 * ```
 */
export const useRealtimeViews = (slug: string) => {
    const nuxtApp = useNuxtApp()

    const views = useState<number>(`blog:views:${slug}`, () => 0)
    const loading = useState<boolean>(`blog:views:loading:${slug}`, () => true)

    let unsubscribe: Unsubscribe | null = null
    let viewsRef: DatabaseReference | null = null

    const init = () => {
        if (import.meta.server) return

        const db = nuxtApp.$firebaseDatabase as Database
        if (!db) {
            console.warn('[@vantol/blog] Firebase Database not available. Make sure to set up Firebase.')
            loading.value = false
            return
        }

        viewsRef = dbRef(db, `posts/${slug}/views`)

        // Listen for real-time updates
        unsubscribe = onValue(viewsRef, (snapshot) => {
            views.value = snapshot.val() || 0
            loading.value = false
        })
    }

    const trackView = async () => {
        if (import.meta.server) return
        if (hasViewedPost(slug)) return // Don't count same session twice

        const db = nuxtApp.$firebaseDatabase as Database
        if (!db) return

        const viewsRefLocal = dbRef(db, `posts/${slug}/views`)

        await runTransaction(viewsRefLocal, (currentValue) => {
            return (currentValue || 0) + 1
        })

        markPostViewed(slug)
    }

    const cleanup = () => {
        if (unsubscribe) {
            unsubscribe()
            unsubscribe = null
        }
    }

    return {
        views,
        loading,
        init,
        trackView,
        cleanup
    }
}
