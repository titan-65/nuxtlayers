import { auth } from '../utils/auth'

/**
 * Catch-all API handler for Better Auth.
 * Handles all auth routes: /api/auth/*
 */
export default defineEventHandler(async (event) => {
    return auth.handler(toWebRequest(event))
})
