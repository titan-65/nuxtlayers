import { defineStore } from 'pinia'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
    const nuxtApp = useNuxtApp()
    const config = useRuntimeConfig()

    const user = ref<User | null>(null)
    const loading = ref(true)
    const isInitialized = ref(false)

    // Admin emails from config
    const adminEmails = computed(() => {
        const raw = ((config.public as any).adminEmails || '').trim()
        if (!raw) return [] as string[]
        return raw.split(',').map((email: string) => email.trim().toLowerCase()).filter(Boolean)
    })

    // Is Admin Check
    const isAdmin = computed(() => {
        const email = user.value?.email?.toLowerCase()
        if (!email) return false
        return adminEmails.value.includes(email)
    })

    // Initialize Auth Listener
    function initialize() {
        if (import.meta.server) {
            loading.value = false
            return
        }

        if (isInitialized.value) return

        const auth = nuxtApp.$firebaseAuth as any
        if (!auth) {
            console.warn('Firebase Auth not available')
            loading.value = false
            return
        }

        onAuthStateChanged(auth, (nextUser) => {
            user.value = nextUser
            loading.value = false
            isInitialized.value = true
        })
    }

    // Sign In with Google
    async function signInWithGoogle() {
        const auth = nuxtApp.$firebaseAuth as any
        const provider = nuxtApp.$firebaseGoogleProvider as any

        if (!auth || !provider) return

        try {
            await signInWithPopup(auth, provider)
        } catch (error: any) {
            if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/popup-closed-by-user') {
                await signInWithRedirect(auth, provider)
            } else {
                throw error
            }
        }
    }

    // Sign Out
    async function logout() {
        const auth = nuxtApp.$firebaseAuth as any
        if (auth) {
            await signOut(auth)
            user.value = null
        }
    }

    return {
        user,
        loading,
        isAdmin,
        initialize,
        signInWithGoogle,
        logout
    }
})
