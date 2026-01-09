<script setup lang="ts">
/**
 * Account settings page.
 */
useHead({
  title: 'Account Settings - NuxtLayers'
})

definePageMeta({
  middleware: 'auth'
})

// Mock data
const user = ref({
  name: 'Vantol Bennett',
  email: 'hello@vantolbennett.com',
  organization: '@vantol',
  apiKey: 'nlk_xxxx...xxxx'
})

const showApiKey = ref(false)
</script>

<template>
  <div class="min-h-screen bg-[#F3F3F3] selection:bg-black selection:text-white">
    <!-- Navigation -->
    <nav class="sticky top-0 z-50 border-b border-black/10 bg-[#F3F3F3]/90 backdrop-blur-sm">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="w-2 h-2 bg-red-500 rounded-full"></span>
          <span class="text-xs font-bold uppercase tracking-widest">NuxtLayers</span>
        </NuxtLink>
        <div class="flex items-center gap-6">
          <NuxtLink to="/dashboard" class="text-xs font-mono text-gray-500 hover:text-black transition-colors uppercase">Dashboard</NuxtLink>
          <NuxtLink to="/account" class="text-xs font-mono text-black uppercase">Account</NuxtLink>
        </div>
      </div>
    </nav>

    <div class="max-w-3xl mx-auto px-6 py-12">
      <div class="wireframe-section-title mb-4">
        <span>Settings</span>
      </div>
      <h1 class="text-3xl font-bold mb-2 tracking-tight">Account</h1>
      <p class="text-gray-500 font-light text-sm mb-8">Manage your publisher profile and API access.</p>

      <!-- Profile -->
      <section class="mb-8">
        <h2 class="text-sm font-bold uppercase tracking-wide mb-4">Profile</h2>
        <div class="wireframe-card p-6 space-y-4">
          <div>
            <label class="text-[10px] font-mono text-gray-400 uppercase block mb-2">Name</label>
            <input v-model="user.name" class="wireframe-input w-full" />
          </div>
          <div>
            <label class="text-[10px] font-mono text-gray-400 uppercase block mb-2">Email</label>
            <input v-model="user.email" type="email" class="wireframe-input w-full" />
          </div>
          <div>
            <label class="text-[10px] font-mono text-gray-400 uppercase block mb-2">Organization</label>
            <input v-model="user.organization" class="wireframe-input w-full" placeholder="@your-org" />
          </div>
          <button class="wireframe-btn">Save Changes</button>
        </div>
      </section>

      <!-- API Key -->
      <section class="mb-8">
        <h2 class="text-sm font-bold uppercase tracking-wide mb-4">API Key</h2>
        <div class="wireframe-card p-6">
          <p class="text-xs text-gray-500 font-light mb-4">Use this key to publish layers via the CLI.</p>
          <div class="flex items-center gap-4">
            <code class="wireframe-input flex-1 font-mono text-xs">
              {{ showApiKey ? 'nlk_abc123def456ghi789jkl' : 'nlk_xxxx...xxxx' }}
            </code>
            <button @click="showApiKey = !showApiKey" class="wireframe-btn-outline text-[10px]">
              {{ showApiKey ? 'Hide' : 'Show' }}
            </button>
          </div>
          <p class="text-[10px] text-gray-400 mt-3">
            Run <code class="bg-gray-100 px-1">nuxt-layers login</code> to authenticate the CLI.
          </p>
        </div>
      </section>

      <!-- Danger Zone -->
      <section>
        <h2 class="text-sm font-bold uppercase tracking-wide mb-4 text-red-600">Danger Zone</h2>
        <div class="wireframe-card p-6 border-red-200">
          <p class="text-xs text-gray-500 font-light mb-4">Permanently delete your account and all published layers.</p>
          <button class="text-[10px] font-mono uppercase tracking-wide text-red-600 border border-red-200 px-4 py-2 hover:bg-red-50 transition-colors">
            Delete Account
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
