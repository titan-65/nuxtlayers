import { betterAuth } from 'better-auth'

/**
 * Better Auth server instance.
 * Configure database adapter based on your setup.
 */
export const auth = betterAuth({
    // Database adapter - configure in consuming app
    // Example: adapter: drizzleAdapter(db)

    emailAndPassword: {
        enabled: true
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || ''
        }
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24 // 1 day
    }
})
