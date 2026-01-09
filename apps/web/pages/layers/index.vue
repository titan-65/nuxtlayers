<script setup lang="ts">
useHead({
  title: 'Browse Layers - NuxtLayers'
})

const searchQuery = ref('')
const selectedTags = ref<string[]>([])

const layers = ref([
  { id: '@vantol/auth-firebase', description: 'Firebase Auth with Google SSO', version: '1.0.0', downloads: 2400, tags: ['auth', 'firebase', 'sso'], official: true },
  { id: '@vantol/auth-clerk', description: 'Clerk authentication with UI components', version: '1.0.0', downloads: 1800, tags: ['auth', 'clerk', 'sso'], official: true },
  { id: '@vantol/auth-better', description: 'Better Auth with email and social login', version: '1.0.0', downloads: 1500, tags: ['auth', 'email', 'sso'], official: true },
  { id: '@vantol/blog', description: 'Real-time blog with comments and reactions', version: '1.0.0', downloads: 1800, tags: ['blog', 'cms', 'firebase'], official: true },
  { id: '@vantol/admin', description: 'Admin dashboard with sidebar and tables', version: '1.0.0', downloads: 1200, tags: ['admin', 'dashboard', 'ui'], official: true },
  { id: '@vantol/payments', description: 'Stripe checkout and subscriptions', version: '1.0.0', downloads: 980, tags: ['payments', 'stripe', 'billing'], official: true },
  { id: '@vantol/landing', description: 'Landing page with hero and features', version: '1.0.0', downloads: 1560, tags: ['landing', 'marketing', 'ui'], official: true }
])

const allTags = computed(() => {
  const tags = new Set<string>()
  layers.value.forEach(l => l.tags.forEach(t => tags.add(t)))
  return Array.from(tags).sort()
})

const filteredLayers = computed(() => {
  let result = layers.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(l => l.id.toLowerCase().includes(query) || l.description.toLowerCase().includes(query))
  }
  if (selectedTags.value.length > 0) {
    result = result.filter(l => selectedTags.value.some(t => l.tags.includes(t)))
  }
  return result.sort((a, b) => b.downloads - a.downloads)
})

const toggleTag = (tag: string) => {
  const idx = selectedTags.value.indexOf(tag)
  if (idx >= 0) selectedTags.value.splice(idx, 1)
  else selectedTags.value.push(tag)
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
          <NuxtLink to="/layers" class="text-xs font-mono text-white uppercase">Browse</NuxtLink>
          <NuxtLink to="/docs" class="text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase">Docs</NuxtLink>
          <NuxtLink to="/login" class="dark-btn text-xs">Log In</NuxtLink>
        </div>
      </div>
    </nav>

    <div class="max-w-6xl mx-auto px-6 py-12">
      <!-- Header -->
      <div class="mb-8">
        <div class="dark-section-title mb-4">
          <span>Registry</span>
        </div>
        <h1 class="text-3xl font-bold mb-2 tracking-tight">Browse Layers</h1>
        <p class="text-gray-500 font-light text-sm">Discover pre-built Nuxt Layers to supercharge your app</p>
      </div>

      <!-- Search & Filters -->
      <div class="flex flex-col md:flex-row gap-4 mb-8">
        <div class="relative flex-1">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          <input
            v-model="searchQuery"
            placeholder="Search layers..."
            class="dark-input w-full pl-10"
          />
        </div>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="tag in allTags.slice(0, 6)"
            :key="tag"
            @click="toggleTag(tag)"
            class="text-[10px] font-mono uppercase tracking-wide px-3 py-1.5 border transition-colors"
            :class="selectedTags.includes(tag) ? 'bg-orange-500 text-black border-orange-500' : 'border-white/20 text-gray-400 hover:border-white/40'"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- Results -->
      <div class="space-y-4">
        <NuxtLink
          v-for="layer in filteredLayers"
          :key="layer.id"
          :to="`/layers/${encodeURIComponent(layer.id)}`"
          class="block dark-card p-6 hover:border-white/30 transition-colors group"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-sm font-bold group-hover:text-orange-500 transition-colors">{{ layer.id }}</h3>
                <span v-if="layer.official" class="text-[10px] font-mono text-orange-500 uppercase">Official</span>
              </div>
              <p class="text-xs text-gray-500 font-light">{{ layer.description }}</p>
            </div>
            <code class="text-[10px] font-mono text-gray-600">v{{ layer.version }}</code>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex gap-4 text-[10px] font-mono text-gray-600">
              <span>↓ {{ formatNumber(layer.downloads) }}</span>
            </div>
            <div class="flex gap-1">
              <span v-for="tag in layer.tags" :key="tag" class="text-[10px] font-mono text-gray-600 bg-white/5 px-2 py-0.5">
                {{ tag }}
              </span>
            </div>
          </div>
        </NuxtLink>

        <div v-if="filteredLayers.length === 0" class="text-center py-12">
          <p class="text-gray-600 font-mono text-sm">No layers found matching your search.</p>
        </div>
      </div>
    </div>
  </div>
</template>
