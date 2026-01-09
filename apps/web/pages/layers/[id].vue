<script setup lang="ts">
const route = useRoute()
const layerId = computed(() => decodeURIComponent(route.params.id as string))

const layer = ref({
  id: layerId.value || '@vantol/auth-firebase',
  description: 'Complete authentication with Google SSO, middleware, and user state management.',
  version: '1.0.0',
  downloads: 2400,
  tags: ['auth', 'firebase', 'sso'],
  official: true,
  author: { name: 'Vantol Bennett' },
  readme: `# ${layerId.value}

Complete authentication layer for Nuxt applications.

## Features
- 🔐 Google SSO
- 🛡️ Route middleware protection
- 👤 User state management

## Installation
$ npx nuxt-layers add ${layerId.value}

## Composables
- useFirebaseAuth() - User state and auth methods

## Middleware
- auth - Require authentication`
})

useHead({ title: () => `${layer.value.id} - NuxtLayers` })

const copied = ref(false)
const installCommand = computed(() => `npx nuxt-layers add ${layer.value.id}`)

const copyCommand = async () => {
  await navigator.clipboard.writeText(installCommand.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

const formatNumber = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n.toString()
</script>

<template>
  <div class="min-h-screen bg-[#0A0A0A] text-white selection:bg-orange-500 selection:text-black">
    <!-- Navigation -->
    <nav class="sticky top-0 z-50 border-b border-white/10 bg-[#0A0A0A]/90 backdrop-blur-sm">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="w-2 h-2 bg-orange-500 rounded-full"></span>
          <span class="text-xs font-bold uppercase tracking-widest">NuxtLayers</span>
        </NuxtLink>
        <div class="flex items-center gap-6">
          <NuxtLink to="/layers" class="text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase">Browse</NuxtLink>
          <NuxtLink to="/docs" class="text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase">Docs</NuxtLink>
          <NuxtLink to="/login" class="dark-btn text-xs">Log In</NuxtLink>
        </div>
      </div>
    </nav>

    <div class="max-w-4xl mx-auto px-6 py-8">
      <!-- Back Link -->
      <NuxtLink to="/layers" class="inline-flex items-center gap-1 text-[10px] font-mono text-gray-500 hover:text-orange-500 mb-6 uppercase">
        ← Back to layers
      </NuxtLink>

      <!-- Header -->
      <div class="mb-8">
        <div class="dark-section-title mb-4">
          <span>Layer</span>
        </div>
        <div class="flex items-center gap-3 mb-2">
          <h1 class="text-2xl font-bold tracking-tight">{{ layer.id }}</h1>
          <span v-if="layer.official" class="text-[10px] font-mono text-orange-500 uppercase">Official</span>
        </div>
        <p class="text-gray-500 font-light text-sm mb-4">{{ layer.description }}</p>
        
        <div class="flex items-center gap-4 text-[10px] font-mono text-gray-600">
          <span>↓ {{ formatNumber(layer.downloads) }} downloads</span>
          <span>v{{ layer.version }}</span>
        </div>
      </div>

      <!-- Install Command -->
      <div class="terminal-window mb-8">
        <div class="terminal-header">
          <div class="terminal-dot bg-red-500"></div>
          <div class="terminal-dot bg-yellow-500"></div>
          <div class="terminal-dot bg-green-500"></div>
          <span class="text-[10px] font-mono text-gray-500 ml-2">INSTALL</span>
        </div>
        <div class="terminal-body flex items-center justify-between">
          <code><span class="text-orange-500">$</span> {{ installCommand }}</code>
          <button @click="copyCommand" class="text-[10px] font-mono text-gray-500 hover:text-orange-500 uppercase">
            {{ copied ? '✓' : 'Copy' }}
          </button>
        </div>
      </div>

      <!-- Tags -->
      <div class="flex gap-2 mb-8">
        <span v-for="tag in layer.tags" :key="tag" class="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-0.5">
          {{ tag }}
        </span>
      </div>

      <!-- README -->
      <div class="terminal-window mb-8">
        <div class="terminal-header">
          <div class="terminal-dot bg-red-500"></div>
          <div class="terminal-dot bg-yellow-500"></div>
          <div class="terminal-dot bg-green-500"></div>
          <span class="text-[10px] font-mono text-gray-500 ml-2">README.MD</span>
        </div>
        <div class="terminal-body">
          <pre class="whitespace-pre-wrap text-gray-400 leading-relaxed">{{ layer.readme }}</pre>
        </div>
      </div>

      <!-- Author -->
      <div class="border-t border-white/10 pt-8">
        <div class="text-[10px] font-mono text-gray-600 uppercase mb-2">Published by</div>
        <span class="text-sm font-medium">{{ layer.author.name }}</span>
      </div>
    </div>
  </div>
</template>
