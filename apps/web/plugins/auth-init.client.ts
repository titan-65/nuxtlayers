export default defineNuxtPlugin(async (nuxtApp) => {
    const authStore = useAuthStore()

    // Wait for Firebase to be provided (firebase.client.ts is also a plugin)
    // Plugins run in order, so we hope firebase runs first.
    // Actually, depending on alphabetical order or priority. 
    // 'firebase.client.ts' vs 'auth-init.client.ts'. 'a' comes before 'f'. 
    // So auth-init runs FIRST. That's a problem if strict order needed.
    // But wait, useAuthStore() uses useNuxtApp().$firebaseAuth inside the initialize() function.
    // If we call initialize() now, $firebaseAuth might not be ready if plugins run sequential.
    // We should make sure this plugin runs AFTER firebase. Or maybe use hook?

    // Actually, plugins run in parallel or sequence? 
    // Nuxt plugins are sequential.
    // Strategy: We can rename this to 'z-auth-init' or use 'dependsOn' (Nuxt 3 doesn't have explicit dependsOn for plugins easily).
    // Better: Just call init() but inside init(), check if auth exists.
    // If useFirebaseAuth() (old one) was working, it was because it waited or was called in onMounted?
    // Old one used: const auth = nuxtApp.$firebaseAuth

    // Let's rely on onMounted or nextTick if immediate access fails?
    // But defineNuxtPlugin runs before app mount. 
    // We can hook into 'app:mounted'.

    nuxtApp.hook('app:mounted', () => {
        authStore.initialize()
    })
})
