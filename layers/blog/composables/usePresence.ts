import { ref as dbRef, onValue, remove, set, onDisconnect, serverTimestamp } from 'firebase/database'
import type { Database, Unsubscribe } from 'firebase/database'

function generateVisitorId(): string {
    if (import.meta.server) return ''

    let visitorId = sessionStorage.getItem('blog:visitorId')
    if (!visitorId) {
        visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        sessionStorage.setItem('blog:visitorId', visitorId)
    }
    return visitorId
}

/**
 * Real-time presence tracking - shows how many people are currently reading a post.
 * 
 * @example
 * ```ts
 * const { activeReaders, init, joinPost, cleanup } = usePresence('my-post-slug')
 * 
 * onMounted(() => {
 *   init()
 *   joinPost()
 * })
 * 
 * onUnmounted(() => cleanup())
 * ```
 */
export const usePresence = (slug: string) => {
    const nuxtApp = useNuxtApp()

    const activeReaders = useState<number>(`blog:presence:${slug}`, () => 0)
    const isConnected = useState<boolean>(`blog:presence:connected:${slug}`, () => false)

    let presenceUnsubscribe: Unsubscribe | null = null
    let connectionUnsubscribe: Unsubscribe | null = null
    let myPresenceRef: ReturnType<typeof dbRef> | null = null

    const init = () => {
        if (import.meta.server) return

        const db = nuxtApp.$firebaseDatabase as Database
        if (!db) {
            console.warn('[@vantol/blog] Firebase Database not available.')
            return
        }

        const presenceRef = dbRef(db, `posts/${slug}/presence`)

        // Listen for presence changes
        presenceUnsubscribe = onValue(presenceRef, (snapshot) => {
            const data = snapshot.val()
            activeReaders.value = data ? Object.keys(data).length : 0
        })
    }

    const joinPost = () => {
        if (import.meta.server) return

        const visitorId = generateVisitorId()
        if (!visitorId) return

        const db = nuxtApp.$firebaseDatabase as Database
        if (!db) return

        myPresenceRef = dbRef(db, `posts/${slug}/presence/${visitorId}`)
        const connectedRef = dbRef(db, '.info/connected')

        connectionUnsubscribe = onValue(connectedRef, (snap) => {
            if (snap.val() === true) {
                isConnected.value = true

                // Set up onDisconnect to remove presence when disconnected
                onDisconnect(myPresenceRef!).remove()

                // Mark as present
                set(myPresenceRef!, {
                    joinedAt: serverTimestamp()
                })
            } else {
                isConnected.value = false
            }
        })
    }

    const leavePost = () => {
        if (import.meta.server) return
        if (!myPresenceRef) return

        // Remove presence immediately
        remove(myPresenceRef)
        myPresenceRef = null
    }

    const cleanup = () => {
        leavePost()

        if (presenceUnsubscribe) {
            presenceUnsubscribe()
            presenceUnsubscribe = null
        }
        if (connectionUnsubscribe) {
            connectionUnsubscribe()
            connectionUnsubscribe = null
        }
    }

    return {
        activeReaders,
        isConnected,
        init,
        joinPost,
        leavePost,
        cleanup
    }
}
