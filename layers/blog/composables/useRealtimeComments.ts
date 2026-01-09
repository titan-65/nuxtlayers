import { ref as dbRef, onValue, push, remove, set, serverTimestamp, query, orderByChild } from 'firebase/database'
import type { Database, Unsubscribe } from 'firebase/database'

export interface BlogComment {
    id: string
    text: string
    authorName: string
    authorEmail: string
    authorPhoto: string
    createdAt: number
}

/**
 * Real-time comments for blog posts using Firebase Realtime Database.
 * 
 * @example
 * ```ts
 * const { comments, loading, init, addComment, deleteComment, cleanup } = useRealtimeComments('my-post-slug')
 * 
 * onMounted(() => init())
 * onUnmounted(() => cleanup())
 * 
 * // Add a comment (requires user auth)
 * await addComment('Great post!')
 * ```
 */
export const useRealtimeComments = (slug: string) => {
    const nuxtApp = useNuxtApp()

    const comments = useState<BlogComment[]>(`blog:comments:${slug}`, () => [])
    const loading = useState<boolean>(`blog:comments:loading:${slug}`, () => true)

    let unsubscribe: Unsubscribe | null = null

    // Get current user - check for auth composable
    const getCurrentUser = () => {
        // Try to get user from useFirebaseAuth if available
        try {
            const auth = (nuxtApp as any).$firebaseAuth
            return auth?.currentUser || null
        } catch {
            return null
        }
    }

    const init = () => {
        if (import.meta.server) return

        const db = nuxtApp.$firebaseDatabase as Database
        if (!db) {
            console.warn('[@vantol/blog] Firebase Database not available.')
            loading.value = false
            return
        }

        const commentsRef = dbRef(db, `posts/${slug}/comments`)
        const commentsQuery = query(commentsRef, orderByChild('createdAt'))

        unsubscribe = onValue(commentsQuery, (snapshot) => {
            const data = snapshot.val()
            if (!data) {
                comments.value = []
                loading.value = false
                return
            }

            // Convert object to array with IDs
            const commentsList: BlogComment[] = Object.entries(data).map(([id, value]: [string, any]) => ({
                id,
                text: value.text,
                authorName: value.authorName,
                authorEmail: value.authorEmail,
                authorPhoto: value.authorPhoto,
                createdAt: value.createdAt
            }))

            // Sort by creation time (oldest first)
            commentsList.sort((a, b) => a.createdAt - b.createdAt)
            comments.value = commentsList
            loading.value = false
        })
    }

    const addComment = async (text: string, user?: { displayName?: string; email?: string; photoURL?: string }) => {
        const currentUser = user || getCurrentUser()

        if (!currentUser) {
            throw new Error('Must be logged in to comment')
        }

        const db = nuxtApp.$firebaseDatabase as Database
        if (!db) throw new Error('Firebase Database not available')

        const commentsRef = dbRef(db, `posts/${slug}/comments`)
        const newCommentRef = push(commentsRef)

        await set(newCommentRef, {
            text: text.trim(),
            authorName: currentUser.displayName || 'Anonymous',
            authorEmail: currentUser.email || '',
            authorPhoto: currentUser.photoURL || '',
            createdAt: serverTimestamp()
        })
    }

    const deleteComment = async (commentId: string, userEmail?: string, isAdmin = false) => {
        const db = nuxtApp.$firebaseDatabase as Database
        if (!db) return

        const commentRef = dbRef(db, `posts/${slug}/comments/${commentId}`)

        // Check if user owns the comment or is admin
        const commentData = comments.value.find(c => c.id === commentId)
        if (!commentData) return

        const canDelete = isAdmin || commentData.authorEmail === userEmail
        if (!canDelete) {
            throw new Error('Not authorized to delete this comment')
        }

        await remove(commentRef)
    }

    const cleanup = () => {
        if (unsubscribe) {
            unsubscribe()
            unsubscribe = null
        }
    }

    return {
        comments,
        loading,
        init,
        addComment,
        deleteComment,
        cleanup
    }
}
