/**
 * Auth middleware for protected routes.
 * Redirects unauthenticated users to sign-in page.
 */
export default defineNuxtRouteMiddleware((to) => {
    const { isAuthenticated, loading } = useBetterAuth()

    // Wait for session to load
    if (loading.value) {
        return
    }

    // Redirect to sign-in if not authenticated
    if (!isAuthenticated.value) {
        return navigateTo('/sign-in?redirect=' + encodeURIComponent(to.fullPath))
    }
})
