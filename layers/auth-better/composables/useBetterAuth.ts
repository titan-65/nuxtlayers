import { createAuthClient } from 'better-auth/vue'

const authClient = createAuthClient()

/**
 * Better Auth composable.
 * Provides consistent interface matching other auth layers.
 * 
 * @example
 * ```ts
 * const { user, loading, signIn, signUp, signOut } = useBetterAuth()
 * 
 * // Sign in with email
 * await signIn({ email: 'user@example.com', password: 'secret' })
 * 
 * // Sign in with social provider
 * await signInWithProvider('google')
 * ```
 */
export const useBetterAuth = () => {
    const config = useRuntimeConfig()

    const session = authClient.useSession()

    const loading = computed(() => session.isPending)

    const user = computed(() => {
        const data = session.data?.user
        if (!data) return null
        return {
            id: data.id,
            email: data.email,
            displayName: data.name || data.email.split('@')[0],
            photoURL: data.image,
            emailVerified: data.emailVerified
        }
    })

    const isAuthenticated = computed(() => !!session.data?.user)

    // Admin detection via config
    const adminEmails = computed(() => {
        const raw = ((config.public as any).adminEmails || '').trim()
        if (!raw) return [] as string[]
        return raw.split(',').map((e: string) => e.trim().toLowerCase()).filter(Boolean)
    })

    const isAdmin = computed(() => {
        const email = user.value?.email?.toLowerCase()
        if (!email) return false
        return adminEmails.value.includes(email)
    })

    const signIn = async (credentials: { email: string; password: string }) => {
        await authClient.signIn.email(credentials)
    }

    const signUp = async (data: { email: string; password: string; name?: string }) => {
        await authClient.signUp.email(data)
    }

    const signInWithProvider = async (provider: 'google' | 'github') => {
        await authClient.signIn.social({ provider })
    }

    const signOut = async () => {
        await authClient.signOut()
    }

    return {
        user,
        loading,
        isAuthenticated,
        isAdmin,
        session,
        signIn,
        signUp,
        signInWithProvider,
        signOut
    }
}
