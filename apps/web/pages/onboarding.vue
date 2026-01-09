<script setup lang="ts">
/**
 * Publisher onboarding page.
 * Guides new publishers through account setup.
 */
useHead({
  title: 'Get Started as Publisher - NuxtLayers'
})

const currentStep = ref(1)
const formData = ref({
  name: '',
  email: '',
  organization: '',
  agreeToTerms: false
})

const handleSubmit = () => {
  // Will submit to API
  navigateTo('/dashboard')
}
</script>

<template>
  <div class="min-h-screen bg-[#F3F3F3] selection:bg-black selection:text-white">
    <!-- Navigation -->
    <nav class="border-b border-black/10 bg-[#F3F3F3]">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="w-2 h-2 bg-red-500 rounded-full"></span>
          <span class="text-xs font-bold uppercase tracking-widest">NuxtLayers</span>
        </NuxtLink>
      </div>
    </nav>

    <div class="max-w-xl mx-auto px-6 py-16">
      <div class="wireframe-section-title mb-4">
        <span>Onboarding</span>
      </div>
      <h1 class="text-3xl font-bold mb-2 tracking-tight">Become a Publisher</h1>
      <p class="text-gray-500 font-light text-sm mb-8">Share your Nuxt layers with the community.</p>

      <!-- Steps indicator -->
      <div class="flex gap-2 mb-12">
        <div
          v-for="step in 3"
          :key="step"
          class="h-1 flex-1 transition-colors"
          :class="step <= currentStep ? 'bg-black' : 'bg-gray-200'"
        />
      </div>

      <!-- Step 1: Account -->
      <div v-if="currentStep === 1" class="space-y-6">
        <h2 class="text-sm font-bold uppercase tracking-wide">Create Your Account</h2>
        
        <div class="wireframe-card p-6 space-y-4">
          <div>
            <label class="text-[10px] font-mono text-gray-400 uppercase block mb-2">Name</label>
            <input v-model="formData.name" class="wireframe-input w-full" placeholder="Your name" />
          </div>
          <div>
            <label class="text-[10px] font-mono text-gray-400 uppercase block mb-2">Email</label>
            <input v-model="formData.email" type="email" class="wireframe-input w-full" placeholder="you@example.com" />
          </div>
        </div>

        <button @click="currentStep = 2" class="wireframe-btn" :disabled="!formData.name || !formData.email">
          Continue →
        </button>
      </div>

      <!-- Step 2: Organization -->
      <div v-if="currentStep === 2" class="space-y-6">
        <h2 class="text-sm font-bold uppercase tracking-wide">Set Up Your Organization</h2>
        
        <div class="wireframe-card p-6 space-y-4">
          <div>
            <label class="text-[10px] font-mono text-gray-400 uppercase block mb-2">Organization Name</label>
            <div class="flex items-center">
              <span class="text-gray-400 mr-1">@</span>
              <input v-model="formData.organization" class="wireframe-input flex-1" placeholder="your-org" />
            </div>
            <p class="text-[10px] text-gray-400 mt-2">This will be your layer namespace, e.g. @your-org/layer-name</p>
          </div>
        </div>

        <div class="flex gap-4">
          <button @click="currentStep = 1" class="wireframe-btn-outline">← Back</button>
          <button @click="currentStep = 3" class="wireframe-btn" :disabled="!formData.organization">
            Continue →
          </button>
        </div>
      </div>

      <!-- Step 3: Terms -->
      <div v-if="currentStep === 3" class="space-y-6">
        <h2 class="text-sm font-bold uppercase tracking-wide">Accept Terms</h2>
        
        <div class="wireframe-card p-6">
          <div class="prose prose-sm text-gray-500 mb-4">
            <h3 class="text-sm font-bold text-black">Publisher Agreement</h3>
            <ul class="text-xs space-y-2">
              <li>You retain ownership of your layers</li>
              <li>Layers must not contain malicious code</li>
              <li>You agree to our content guidelines</li>
              <li>We may remove layers that violate terms</li>
            </ul>
          </div>
          <label class="flex items-center gap-2 text-xs">
            <input type="checkbox" v-model="formData.agreeToTerms" class="w-4 h-4" />
            I agree to the Publisher Agreement
          </label>
        </div>

        <div class="flex gap-4">
          <button @click="currentStep = 2" class="wireframe-btn-outline">← Back</button>
          <button @click="handleSubmit" class="wireframe-btn" :disabled="!formData.agreeToTerms">
            Complete Setup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
