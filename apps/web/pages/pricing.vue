<script setup lang="ts">
import { storeToRefs } from 'pinia'

useHead({ title: 'Pricing - NuxtLayers' })

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'For personal projects and exploration',
    features: [
      'Core layers (auth, blog)',
      'Community support',
      'GitHub distribution',
      'Basic documentation'
    ],
    cta: 'Get Started',
    ctaLink: '/layers',
    highlighted: false
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For professional developers and startups',
    features: [
      'All free features',
      'Premium layers (payments, analytics)',
      'Priority support',
      'Analytics dashboard',
      'Domain locking',
      'License key management'
    ],
    cta: 'Upgrade to Pro',
    ctaLink: '/checkout?plan=pro',
    highlighted: true
  },
  {
    name: 'Team',
    price: '$99',
    period: '/month',
    description: 'For growing teams and agencies',
    features: [
      'All Pro features',
      'Team management (5 seats)',
      'White-label options',
      'Private layer hosting',
      'Custom integrations',
      'Dedicated support'
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact?plan=team',
    highlighted: false
  }
]
</script>

<template>
  <div class="min-h-screen bg-[#0A0A0A] text-white selection:bg-orange-500 selection:text-black">
    <div class="max-w-6xl mx-auto px-6 py-16">
      <!-- Header -->
      <div class="text-center mb-16">
        <div class="dark-section-title mb-4">
          <span>Pricing</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Simple, transparent pricing
        </h1>
        <p class="text-gray-500 font-light max-w-xl mx-auto">
          Start free, upgrade when you need premium features. No hidden fees.
        </p>
      </div>

      <!-- Pricing Cards -->
      <div class="grid md:grid-cols-3 gap-8 mb-16">
        <div 
          v-for="plan in plans" 
          :key="plan.name"
          class="dark-card p-8"
          :class="{ 'ring-2 ring-orange-500': plan.highlighted }"
        >
          <div v-if="plan.highlighted" class="text-[10px] font-mono text-orange-500 uppercase mb-4">
            Most Popular
          </div>
          
          <h3 class="text-xl font-bold mb-2">{{ plan.name }}</h3>
          
          <div class="flex items-baseline gap-1 mb-4">
            <span class="text-4xl font-bold">{{ plan.price }}</span>
            <span class="text-gray-500 text-sm">{{ plan.period }}</span>
          </div>
          
          <p class="text-gray-500 text-sm mb-6">{{ plan.description }}</p>
          
          <ul class="space-y-3 mb-8">
            <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-2 text-sm">
              <span class="text-orange-500">✓</span>
              <span class="text-gray-300">{{ feature }}</span>
            </li>
          </ul>
          
          <NuxtLink 
            :to="plan.ctaLink"
            :class="plan.highlighted ? 'dark-btn w-full text-center' : 'dark-btn-outline w-full text-center'"
          >
            {{ plan.cta }}
          </NuxtLink>
        </div>
      </div>

      <!-- FAQ -->
      <div class="max-w-3xl mx-auto">
        <h2 class="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        
        <div class="space-y-6">
          <div class="dark-card p-6">
            <h3 class="font-bold mb-2">How does license validation work?</h3>
            <p class="text-gray-500 text-sm">
              Your license key is validated against our API when your app starts. 
              Premium features are only enabled with a valid, unexpired license.
            </p>
          </div>
          
          <div class="dark-card p-6">
            <h3 class="font-bold mb-2">Can I use the code if it's on GitHub?</h3>
            <p class="text-gray-500 text-sm">
              The layer code is visible, but premium features require server-side 
              validation. Without a valid license, premium features gracefully degrade.
            </p>
          </div>
          
          <div class="dark-card p-6">
            <h3 class="font-bold mb-2">What happens when my license expires?</h3>
            <p class="text-gray-500 text-sm">
              Your app continues to work, but premium features will show an upgrade 
              prompt. Renew your license to restore full functionality.
            </p>
          </div>
          
          <div class="dark-card p-6">
            <h3 class="font-bold mb-2">Can I get a refund?</h3>
            <p class="text-gray-500 text-sm">
              Yes! We offer a 14-day money-back guarantee. If you're not satisfied, 
              contact us for a full refund.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
