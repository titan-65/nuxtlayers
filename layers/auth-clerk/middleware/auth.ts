/**
 * Auth middleware for protected routes.
 * Redirects unauthenticated users to sign-in page.
 * 
 * Usage in pages:
 * ```ts
 * definePageMeta({
 *   middleware: 'auth'
 * })
 * ```
 */
export default defineNuxtRouteMiddleware((to) => {
    const { isSignedIn, isLoaded } = useAuth()

    // Wait for Clerk to load
    if (!isLoaded.value) {
        return
    }

    // Redirect to sign-in if not authenticated
    if (!isSignedIn.value) {
        return navigateTo('/sign-in?redirect=' + encodeURIComponent(to.fullPath))
    }
})
