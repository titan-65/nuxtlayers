import type { User } from 'firebase/auth'
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth'

let initPromise: Promise<User | null> | null = null
let unsubscribe: (() => void) | null = null

/**
 * Firebase authentication composable.
 * Provides user state, admin detection, and Google sign-in.
 * 
 * @example
 * ```ts
 * const { user, loading, isAdmin, init, signInWithGoogle, signOut } = useFirebaseAuth()
 * 
 * onMounted(() => init())
 * 
 * // Sign in
 * await signInWithGoogle()
 * 
 * // Check user
 * if (user.value) {
 *   console.log('Logged in as', user.value.displayName)
 * }
 * ```
 */
export const useFirebaseAuth = () => {
    const nuxtApp = useNuxtApp()
    const config = useRuntimeConfig()

    const user = useState<User | null>('auth:user', () => null)
    const loading = useState<boolean>('auth:loading', () => true)

    // Admin emails from config (comma-separated)
    const adminEmails = computed(() => {
        const raw = ((config.public as any).adminEmails || '').trim()
        if (!raw) return [] as string[]

        return raw
            .split(',')
            .map((email: string) => email.trim().toLowerCase())
            .filter(Boolean)
    })

    const isAdmin = computed(() => {
        const email = user.value?.email?.toLowerCase()
        if (!email) return false
        return adminEmails.value.includes(email)
    })

    const init = () => {
        // Skip on server - Firebase Auth only works on client
        if (import.meta.server) {
            loading.value = false
            return Promise.resolve(null)
        }

        if (initPromise) return initPromise

        initPromise = new Promise(async (resolve) => {
            const auth = nuxtApp.$firebaseAuth as any

            if (!auth) {
                console.warn('[@vantol/auth] Firebase Auth not available. Make sure to set up Firebase.')
                loading.value = false
                resolve(null)
                return
            }

            if (unsubscribe) {
                resolve(user.value)
                return
            }

            // Handle redirect result if returning from Google sign-in
            try {
                await getRedirectResult(auth)
            } catch (error) {
                // Ignore redirect errors - they're common and not critical
            }

            unsubscribe = onAuthStateChanged(auth, (nextUser: User | null) => {
                user.value = nextUser
                loading.value = false
                resolve(nextUser)
            })
        })

        return initPromise
    }

    const signInWithGoogle = async () => {
        if (import.meta.server) return

        const auth = nuxtApp.$firebaseAuth as any
        const provider = nuxtApp.$firebaseGoogleProvider as any

        if (!auth || !provider) {
            console.warn('[@vantol/auth] Firebase Auth or Google provider not available.')
            return
        }

        try {
            // Try popup first (more reliable for development)
            await signInWithPopup(auth, provider)
        } catch (error: any) {
            // If popup is blocked or fails, fall back to redirect
            if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/popup-closed-by-user') {
                await signInWithRedirect(auth, provider)
            } else {
                console.error('[@vantol/auth] Sign in error:', error)
                throw error
            }
        }
    }

    const signOutUser = async () => {
        if (import.meta.server) return
        const auth = nuxtApp.$firebaseAuth as any
        if (!auth) return
        await signOut(auth)
    }

    return {
        user,
        loading,
        isAdmin,
        init,
        signInWithGoogle,
        signOut: signOutUser
    }
}
