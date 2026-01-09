/**
 * Clerk authentication composable.
 * Wraps @clerk/nuxt with a consistent interface matching other auth layers.
 * 
 * @example
 * ```ts
 * const { user, loading, isAdmin, signIn, signOut } = useClerkAuth()
 * 
 * // Clerk handles auth automatically, just access user state
 * if (user.value) {
 *   console.log('Logged in as', user.value.fullName)
 * }
 * ```
 */
export const useClerkAuth = () => {
    // @clerk/nuxt provides useUser and useAuth composables
    const { isLoaded, isSignedIn, user: clerkUser } = useUser()
    const { signOut: clerkSignOut } = useAuth()
    const config = useRuntimeConfig()

    const loading = computed(() => !isLoaded.value)

    const user = computed(() => {
        if (!clerkUser.value) return null
        return {
            id: clerkUser.value.id,
            email: clerkUser.value.primaryEmailAddress?.emailAddress || '',
            displayName: clerkUser.value.fullName || clerkUser.value.firstName || 'User',
            photoURL: clerkUser.value.imageUrl,
            firstName: clerkUser.value.firstName,
            lastName: clerkUser.value.lastName
        }
    })

    const isAuthenticated = computed(() => isSignedIn.value === true)

    // Admin detection via public metadata or config
    const adminEmails = computed(() => {
        const raw = ((config.public as any).adminEmails || '').trim()
        if (!raw) return [] as string[]
        return raw.split(',').map((e: string) => e.trim().toLowerCase()).filter(Boolean)
    })

    const isAdmin = computed(() => {
        // Check Clerk public metadata first
        const metadata = clerkUser.value?.publicMetadata as any
        if (metadata?.role === 'admin') return true

        // Fallback to email check
        const email = user.value?.email?.toLowerCase()
        if (!email) return false
        return adminEmails.value.includes(email)
    })

    const signIn = () => {
        // Clerk handles sign-in via its components
        // Navigate to sign-in page or use <SignInButton>
        navigateTo('/sign-in')
    }

    const signOut = async () => {
        await clerkSignOut()
    }

    return {
        user,
        loading,
        isAuthenticated,
        isAdmin,
        signIn,
        signOut,
        // Expose raw Clerk user for advanced use cases
        clerkUser
    }
}
