<script setup lang="ts">
/**
 * Demo mode banner displayed on SaaS pages for non-authenticated users
 * Shows that the user is viewing a demo of the SaaS Kit
 */
const { user } = useFirebaseAuth()

const isDemoMode = computed(() => !user.value)
const dismissed = ref(false)

const dismiss = () => {
    dismissed.value = true
}
</script>

<template>
    <Transition name="slide">
        <div 
            v-if="isDemoMode && !dismissed"
            class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 shadow-lg"
        >
            <div class="container mx-auto flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <span class="text-xl">✨</span>
                    <span class="font-medium">
                        You're viewing the <strong>SaaS Kit Demo</strong>
                    </span>
                    <span class="text-white/80 hidden sm:inline">
                        — Sign in to access your real dashboard
                    </span>
                </div>
                <div class="flex items-center gap-4">
                    <NuxtLink 
                        to="/pricing" 
                        class="px-4 py-1.5 bg-white text-purple-600 font-semibold rounded-lg text-sm hover:bg-gray-100 transition-colors"
                    >
                        Get License
                    </NuxtLink>
                    <button 
                        @click="dismiss"
                        class="text-white/80 hover:text-white transition-colors"
                        aria-label="Dismiss"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}
</style>
