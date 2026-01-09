import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

let firebaseAdmin: ReturnType<typeof initializeApp> | null = null

export function getFirebaseAdmin() {
    if (firebaseAdmin) return firebaseAdmin

    const config = useRuntimeConfig()

    if (getApps().length === 0) {
        try {
            if (config.firebaseServiceAccount) {
                // Production: Use service account credentials
                firebaseAdmin = initializeApp({
                    credential: cert(JSON.parse(config.firebaseServiceAccount)),
                    storageBucket: config.public.firebase?.storageBucket
                })
            } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
                // Local with credentials file
                firebaseAdmin = initializeApp({
                    credential: applicationDefault(),
                    projectId: config.public.firebase?.projectId,
                    storageBucket: config.public.firebase?.storageBucket
                })
            } else {
                // Fallback: Use project ID from config (requires gcloud auth)
                firebaseAdmin = initializeApp({
                    projectId: config.public.firebase?.projectId,
                    storageBucket: config.public.firebase?.storageBucket
                })
            }
        } catch (error) {
            console.error('Firebase Admin initialization error:', error)
            throw new Error('Firebase Admin SDK not configured. Set FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS.')
        }
    } else {
        firebaseAdmin = getApps()[0]
    }

    return firebaseAdmin
}

export function getDb() {
    getFirebaseAdmin()
    return getFirestore()
}

export function getStorageBucket() {
    getFirebaseAdmin()
    return getStorage().bucket()
}
