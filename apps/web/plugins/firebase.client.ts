import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth'

/**
 * Firebase client-side plugin
 * Initializes Firebase app and provides auth to the app
 */
export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    const firebaseConfig = {
        apiKey: config.public.firebase?.apiKey,
        authDomain: config.public.firebase?.authDomain,
        projectId: config.public.firebase?.projectId,
        storageBucket: config.public.firebase?.storageBucket,
        appId: config.public.firebase?.appId
    }

    // Only initialize if we have a valid config
    if (!firebaseConfig.apiKey) {
        console.warn('[firebase] No API key found. Set NUXT_PUBLIC_FIREBASE_API_KEY in your .env')
        return {}
    }

    // Initialize Firebase (avoid duplicate initialization)
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    const auth = getAuth(app)
    const googleProvider = new GoogleAuthProvider()

    // Connect to emulator in development if needed
    // if (import.meta.dev && import.meta.client) {
    //     connectAuthEmulator(auth, 'http://localhost:9099')
    // }

    return {
        provide: {
            firebaseApp: app,
            firebaseAuth: auth,
            firebaseGoogleProvider: googleProvider
        }
    }
})
