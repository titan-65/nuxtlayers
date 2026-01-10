<script setup lang="ts">
import { storeToRefs } from 'pinia'

useHead({ title: 'Checkout - NuxtLayers' })

const route = useRoute()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

// Get plan from query
const plan = computed(() => route.query.plan as string || 'pro')

const plans = {
  pro: {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For professional developers and startups',
    features: [
      'All free features',
      'Premium layers (payments, analytics)',
      'Priority support',
      'Analytics dashboard',
      'License key management'
    ]
  },
  team: {
    name: 'Team',
    price: '$99',
    period: '/month',
    description: 'For growing teams and agencies',
    features: [
      'All Pro features',
      'Team management (5 seats)',
      'White-label options',
      'Private layer hosting',
      'Dedicated support'
    ]
  }
}

const selectedPlan = computed(() => plans[plan.value as keyof typeof plans] || plans.pro)

// Checkout state
const loading = ref(false)
const error = ref<string | null>(null)

const handleCheckout = async () => {
  if (!user.value) {
    navigateTo('/login?redirect=/checkout?plan=' + plan.value)
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await $fetch<{ url: string }>('/api/payments/checkout', {
      method: 'POST',
      body: {
        plan: plan.value,
        customerEmail: user.value.email,
        metadata: {
          userId: user.value.uid,
          plan: plan.value
        }
      }
    })

    if (response.url) {
      window.location.href = response.url
    }
  } catch (e: any) {
    error.value = e.data?.message || e.message || 'Failed to start checkout'
    console.error('Checkout error:', e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#0A0A0A] text-white selection:bg-orange-500 selection:text-black">
    <div class="max-w-2xl mx-auto px-6 py-16">
      <div class="text-center mb-8">
        <div class="dark-section-title mb-4">
          <span>Checkout</span>
        </div>
        <h1 class="text-3xl font-bold tracking-tight mb-2">
          Upgrade to {{ selectedPlan.name }}
        </h1>
        <p class="text-gray-500 font-light">
          {{ selectedPlan.description }}
        </p>
      </div>

      <!-- Plan Summary -->
      <div class="dark-card p-8 mb-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold">{{ selectedPlan.name }} Plan</h2>
            <p class="text-gray-500 text-sm">Billed monthly</p>
          </div>
          <div class="text-right">
            <span class="text-3xl font-bold">{{ selectedPlan.price }}</span>
            <span class="text-gray-500">{{ selectedPlan.period }}</span>
          </div>
        </div>

        <div class="border-t border-white/10 pt-6">
          <h3 class="text-sm font-bold uppercase text-gray-400 mb-4">Includes</h3>
          <ul class="space-y-3">
            <li v-for="feature in selectedPlan.features" :key="feature" class="flex items-start gap-2 text-sm">
              <span class="text-orange-500">✓</span>
              <span class="text-gray-300">{{ feature }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Auth Check -->
      <div v-if="!user" class="dark-card p-6 text-center mb-8">
        <p class="text-gray-400 mb-4">Sign in to complete your purchase</p>
        <NuxtLink :to="`/login?redirect=/checkout?plan=${plan}`" class="dark-btn">
          Sign In to Continue
        </NuxtLink>
      </div>

      <!-- Checkout Button -->
      <div v-else>
        <div v-if="error" class="dark-card p-4 mb-6 border-red-500/50 bg-red-500/10">
          <p class="text-sm text-red-400">{{ error }}</p>
        </div>

        <button
          @click="handleCheckout"
          :disabled="loading"
          class="dark-btn w-full text-center py-4 text-lg"
          :class="{ 'opacity-50 cursor-not-allowed': loading }"
        >
          {{ loading ? 'Redirecting to payment...' : `Pay ${selectedPlan.price}${selectedPlan.period}` }}
        </button>

        <p class="text-center text-gray-600 text-xs mt-4">
          Secure payment powered by Polar. Cancel anytime.
        </p>
      </div>

      <!-- Back Link -->
      <div class="text-center mt-8">
        <NuxtLink to="/pricing" class="text-gray-500 hover:text-white text-sm">
          ← Back to Pricing
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
