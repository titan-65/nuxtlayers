<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

useHead({
    title: 'Join the Waitlist',
    meta: [
        { name: 'description', content: 'Be the first to know when we launch. Join our waitlist today!' }
    ]
})

const { entry, getStats } = useWaitlist()
const stats = ref<any>(null)

onMounted(async () => {
    stats.value = await getStats()
})
</script>

<template>
    <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center px-4">
        <div class="max-w-2xl w-full py-20">
            <!-- Main Form -->
            <WaitlistForm
                title="Get Early Access"
                subtitle="We're launching something amazing. Join the waitlist to be the first to know."
                button-text="Join Now"
                success-message="You're In! 🎉"
                :show-referral="true"
                :show-position="true"
            />

            <!-- Stats Section -->
            <div v-if="stats" class="mt-16 text-center">
                <div class="inline-flex items-center gap-8 px-8 py-4 bg-white/5 rounded-2xl border border-white/10">
                    <div>
                        <div class="text-3xl font-bold text-orange-500">{{ stats.totalSignups?.toLocaleString() || 0 }}</div>
                        <div class="text-sm text-gray-500">People on waitlist</div>
                    </div>
                </div>

                <!-- Leaderboard -->
                <div v-if="stats.leaderboard?.length" class="mt-8">
                    <h3 class="text-lg font-semibold text-white mb-4">🏆 Top Referrers</h3>
                    <div class="space-y-2">
                        <div
                            v-for="(referrer, index) in stats.leaderboard"
                            :key="index"
                            class="flex items-center justify-between px-4 py-2 bg-white/5 rounded-lg"
                        >
                            <div class="flex items-center gap-3">
                                <span class="text-orange-500 font-mono">#{{ referrer.position }}</span>
                                <span class="text-gray-400">{{ referrer.email }}</span>
                            </div>
                            <span class="text-green-400">{{ referrer.referralCount }} referrals</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
