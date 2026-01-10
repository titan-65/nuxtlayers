<script setup lang="ts">
import { storeToRefs } from 'pinia'

useHead({ title: 'Payment Successful - NuxtLayers' })

const route = useRoute()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const sessionId = computed(() => route.query.session_id as string)

// Fetch license info after successful payment
const { data: licenseData, pending } = await useFetch('/api/license', {
  query: {
    email: user.value?.email
  },
  immediate: !!user.value?.email
})
</script>

<template>
  <div class="min-h-screen bg-[#0A0A0A] text-white selection:bg-orange-500 selection:text-black flex items-center justify-center">
    <div class="max-w-lg mx-auto px-6 py-16 text-center">
      <!-- Success Icon -->
      <div class="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <span class="text-4xl">✓</span>
      </div>

      <h1 class="text-3xl font-bold tracking-tight mb-4">
        Payment Successful!
      </h1>
      <p class="text-gray-500 font-light mb-8">
        Thank you for upgrading. Your license is now active.
      </p>

      <!-- License Info -->
      <div v-if="pending" class="dark-card p-6 mb-8">
        <p class="text-gray-400">Loading license details...</p>
      </div>

      <div v-else-if="licenseData?.licenses?.length" class="dark-card p-6 mb-8 text-left">
        <h2 class="text-sm font-bold uppercase text-gray-400 mb-4">Your License</h2>
        <div v-for="license in licenseData.licenses" :key="license.id" class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-500">Plan</span>
            <span class="font-bold text-orange-500 uppercase">{{ license.plan }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Key</span>
            <span class="font-mono text-sm">{{ license.key }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Expires</span>
            <span>{{ new Date(license.expiresAt).toLocaleDateString() }}</span>
          </div>
        </div>
      </div>

      <div v-else class="dark-card p-6 mb-8">
        <p class="text-gray-400">
          Your license will appear in your dashboard shortly.
        </p>
      </div>

      <!-- Next Steps -->
      <div class="dark-card p-6 mb-8 text-left">
        <h2 class="text-sm font-bold uppercase text-gray-400 mb-4">Next Steps</h2>
        <ol class="space-y-3 text-sm text-gray-300">
          <li class="flex gap-3">
            <span class="text-orange-500 font-bold">1.</span>
            <span>Add your license key to your project's <code class="text-xs bg-white/10 px-1 rounded">.env</code> file</span>
          </li>
          <li class="flex gap-3">
            <span class="text-orange-500 font-bold">2.</span>
            <span>Install premium layers with <code class="text-xs bg-white/10 px-1 rounded">npx nuxt-layers add @vantol/payments</code></span>
          </li>
          <li class="flex gap-3">
            <span class="text-orange-500 font-bold">3.</span>
            <span>Restart your development server</span>
          </li>
        </ol>
      </div>

      <!-- Actions -->
      <div class="flex gap-4 justify-center">
        <NuxtLink to="/dashboard" class="dark-btn">
          Go to Dashboard
        </NuxtLink>
        <NuxtLink to="/docs" class="dark-btn-outline">
          View Documentation
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
