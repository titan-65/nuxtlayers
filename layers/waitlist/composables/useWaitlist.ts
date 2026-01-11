/**
 * Waitlist composable for managing waitlist signups and referrals
 */
import { ref, computed } from 'vue'

interface WaitlistEntry {
    email: string
    referralCode: string
    referredBy?: string
    position: number
    referralCount: number
    createdAt: string
}

interface WaitlistConfig {
    apiBase?: string
    storageKey?: string
}

const waitlistEntry = ref<WaitlistEntry | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useWaitlist(config: WaitlistConfig = {}) {
    const apiBase = config.apiBase || '/api/waitlist'
    const storageKey = config.storageKey || 'waitlist_entry'

    // Load saved entry from localStorage
    const loadSavedEntry = () => {
        if (import.meta.client) {
            const saved = localStorage.getItem(storageKey)
            if (saved) {
                try {
                    waitlistEntry.value = JSON.parse(saved)
                } catch (e) {
                    localStorage.removeItem(storageKey)
                }
            }
        }
    }

    // Save entry to localStorage
    const saveEntry = (entry: WaitlistEntry) => {
        if (import.meta.client) {
            localStorage.setItem(storageKey, JSON.stringify(entry))
        }
        waitlistEntry.value = entry
    }

    // Join the waitlist
    const joinWaitlist = async (email: string, referredBy?: string) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await $fetch<{ success: boolean; data: WaitlistEntry }>(`${apiBase}/join`, {
                method: 'POST',
                body: { email, referredBy }
            })

            if (response.success) {
                saveEntry(response.data)
                return response.data
            }
        } catch (e: any) {
            error.value = e.data?.message || 'Failed to join waitlist'
            throw e
        } finally {
            isLoading.value = false
        }
    }

    // Get referral link
    const referralLink = computed(() => {
        if (!waitlistEntry.value?.referralCode) return null
        const baseUrl = import.meta.client ? window.location.origin : ''
        return `${baseUrl}/waitlist?ref=${waitlistEntry.value.referralCode}`
    })

    // Copy referral link to clipboard
    const copyReferralLink = async () => {
        if (referralLink.value) {
            await navigator.clipboard.writeText(referralLink.value)
            return true
        }
        return false
    }

    // Get waitlist stats
    const getStats = async () => {
        try {
            const response = await $fetch<{ success: boolean; data: any }>(`${apiBase}/stats`)
            return response.data
        } catch (e) {
            console.error('Failed to fetch waitlist stats:', e)
            return null
        }
    }

    // Check position
    const checkPosition = async (email: string) => {
        try {
            const response = await $fetch<{ success: boolean; data: WaitlistEntry }>(`${apiBase}/position`, {
                method: 'POST',
                body: { email }
            })
            if (response.success) {
                saveEntry(response.data)
                return response.data
            }
        } catch (e) {
            console.error('Failed to check position:', e)
            return null
        }
    }

    // Initialize
    loadSavedEntry()

    return {
        entry: waitlistEntry,
        isLoading,
        error,
        referralLink,
        joinWaitlist,
        copyReferralLink,
        getStats,
        checkPosition
    }
}
