<script setup lang="ts">
useHead({ title: 'Payment Cancelled - NuxtLayers' })
</script>

<template>
  <div class="min-h-screen bg-[#0A0A0A] text-white selection:bg-orange-500 selection:text-black flex items-center justify-center">
    <div class="max-w-lg mx-auto px-6 py-16 text-center">
      <!-- Cancel Icon -->
      <div class="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <span class="text-4xl">✕</span>
      </div>

      <h1 class="text-3xl font-bold tracking-tight mb-4">
        Payment Cancelled
      </h1>
      <p class="text-gray-500 font-light mb-8">
        No worries! Your payment was not processed. You can try again whenever you're ready.
      </p>

      <!-- Actions -->
      <div class="flex gap-4 justify-center">
        <NuxtLink to="/pricing" class="dark-btn">
          Return to Pricing
        </NuxtLink>
        <NuxtLink to="/contact" class="dark-btn-outline">
          Contact Us
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
