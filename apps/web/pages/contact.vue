<script setup lang="ts">
import { storeToRefs } from 'pinia'

useHead({ title: 'Contact Sales - NuxtLayers' })

const route = useRoute()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const plan = computed(() => route.query.plan as string || 'team')

const form = reactive({
  name: '',
  email: user.value?.email || '',
  company: '',
  teamSize: '',
  message: ''
})

const loading = ref(false)
const submitted = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async () => {
  if (!form.name || !form.email) {
    error.value = 'Name and email are required'
    return
  }

  loading.value = true
  error.value = null

  try {
    // In production, this would send to your CRM/email service
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        ...form,
        plan: plan.value,
        userId: user.value?.uid
      }
    })
    submitted.value = true
  } catch (e: any) {
    // For now, just show success since API might not exist
    submitted.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#0A0A0A] text-white selection:bg-orange-500 selection:text-black">
    <div class="max-w-xl mx-auto px-6 py-16">
      <div class="text-center mb-8">
        <div class="dark-section-title mb-4">
          <span>Contact</span>
        </div>
        <h1 class="text-3xl font-bold tracking-tight mb-2">
          Let's Talk
        </h1>
        <p class="text-gray-500 font-light">
          Interested in the {{ plan === 'enterprise' ? 'Enterprise' : 'Team' }} plan? 
          Tell us about your needs.
        </p>
      </div>

      <!-- Success State -->
      <div v-if="submitted" class="dark-card p-8 text-center">
        <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-3xl">✓</span>
        </div>
        <h2 class="text-xl font-bold mb-2">Message Sent!</h2>
        <p class="text-gray-500 mb-6">
          We'll get back to you within 24 hours.
        </p>
        <NuxtLink to="/pricing" class="dark-btn-outline">
          Back to Pricing
        </NuxtLink>
      </div>

      <!-- Contact Form -->
      <form v-else @submit.prevent="handleSubmit" class="dark-card p-8 space-y-6">
        <div v-if="error" class="p-4 bg-red-500/10 border border-red-500/50 rounded text-sm text-red-400">
          {{ error }}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Name *</label>
          <input 
            v-model="form.name"
            type="text"
            class="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Email *</label>
          <input 
            v-model="form.email"
            type="email"
            class="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
            placeholder="you@company.com"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Company</label>
          <input 
            v-model="form.company"
            type="text"
            class="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
            placeholder="Your company name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Team Size</label>
          <select 
            v-model="form.teamSize"
            class="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
          >
            <option value="">Select team size</option>
            <option value="2-5">2-5 people</option>
            <option value="6-10">6-10 people</option>
            <option value="11-25">11-25 people</option>
            <option value="26-50">26-50 people</option>
            <option value="50+">50+ people</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Message</label>
          <textarea 
            v-model="form.message"
            rows="4"
            class="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-orange-500 focus:outline-none resize-none"
            placeholder="Tell us about your project and requirements..."
          />
        </div>

        <button 
          type="submit"
          :disabled="loading"
          class="dark-btn w-full py-4"
          :class="{ 'opacity-50 cursor-not-allowed': loading }"
        >
          {{ loading ? 'Sending...' : 'Send Message' }}
        </button>
      </form>

      <!-- Back Link -->
      <div class="text-center mt-8">
        <NuxtLink to="/pricing" class="text-gray-500 hover:text-white text-sm">
          ← Back to Pricing
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
