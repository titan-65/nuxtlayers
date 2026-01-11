<script setup lang="ts">
/**
 * Beautiful waitlist signup form with referral tracking
 */
const props = defineProps<{
    title?: string
    subtitle?: string
    buttonText?: string
    successMessage?: string
    showPosition?: boolean
    showReferral?: boolean
}>()

const emit = defineEmits<{
    (e: 'success', entry: any): void
    (e: 'error', error: string): void
}>()

const { entry, isLoading, error, joinWaitlist, referralLink, copyReferralLink } = useWaitlist()

const email = ref('')
const copied = ref(false)
const submitted = ref(false)

// Get referral code from URL
const route = useRoute()
const referredBy = computed(() => route.query.ref as string | undefined)

const handleSubmit = async () => {
    if (!email.value) return

    try {
        const result = await joinWaitlist(email.value, referredBy.value)
        submitted.value = true
        emit('success', result)
    } catch (e: any) {
        emit('error', e.message || 'Failed to join')
    }
}

const handleCopy = async () => {
    const success = await copyReferralLink()
    if (success) {
        copied.value = true
        setTimeout(() => { copied.value = false }, 2000)
    }
}
</script>

<template>
    <div class="waitlist-form">
        <!-- Pre-signup state -->
        <div v-if="!submitted && !entry" class="space-y-6">
            <div class="text-center">
                <h2 class="text-3xl font-bold text-white mb-2">
                    {{ title || 'Join the Waitlist' }}
                </h2>
                <p class="text-gray-400">
                    {{ subtitle || 'Be the first to know when we launch' }}
                </p>
            </div>

            <form @submit.prevent="handleSubmit" class="flex flex-col sm:flex-row gap-3">
                <input
                    v-model="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    class="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
                <button
                    type="submit"
                    :disabled="isLoading"
                    class="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-400 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    <span v-if="isLoading">Joining...</span>
                    <span v-else>{{ buttonText || 'Join Waitlist' }}</span>
                </button>
            </form>

            <p v-if="error" class="text-red-400 text-sm text-center">{{ error }}</p>

            <p v-if="referredBy" class="text-green-400 text-sm text-center">
                🎉 You were referred by a friend!
            </p>
        </div>

        <!-- Post-signup success state -->
        <div v-else class="text-center space-y-6">
            <div class="text-6xl mb-4">🎉</div>
            <h2 class="text-2xl font-bold text-white">
                {{ successMessage || "You're on the list!" }}
            </h2>

            <!-- Position badge -->
            <div v-if="showPosition !== false && entry" class="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-full">
                <span class="text-orange-400 font-mono text-sm">Position #{{ entry.position }}</span>
            </div>

            <!-- Referral section -->
            <div v-if="showReferral !== false && referralLink" class="space-y-4 mt-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                <h3 class="font-semibold text-white">Skip the line!</h3>
                <p class="text-gray-400 text-sm">
                    Share your referral link and move up {{ entry?.referralCount || 0 }} spots for each signup
                </p>

                <div class="flex items-center gap-2">
                    <input
                        :value="referralLink"
                        readonly
                        class="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm font-mono"
                    />
                    <button
                        @click="handleCopy"
                        class="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                        {{ copied ? '✓ Copied!' : 'Copy' }}
                    </button>
                </div>

                <div v-if="entry?.referralCount" class="text-green-400 text-sm">
                    🏆 {{ entry.referralCount }} referrals so far!
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.waitlist-form {
    max-width: 500px;
    margin: 0 auto;
}
</style>
