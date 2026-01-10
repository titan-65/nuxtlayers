<script setup lang="ts">
useHead({
  title: 'Browse Layers - NuxtLayers'
})

const searchQuery = ref('')
const selectedTags = ref<string[]>([])

// Fetch layers from API
const layers = ref<any[]>([])
const loading = ref(true)

const { data: layersData } = await useFetch('/api/layers')

if (layersData.value?.success) {
  layers.value = layersData.value.data?.layers || []
}
loading.value = false

const allTags = computed(() => {
  const tags = new Set<string>()
  layers.value.forEach((l: any) => l.tags?.forEach((t: string) => tags.add(t)))
  return Array.from(tags).sort()
})

const filteredLayers = computed(() => {
  let result = layers.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((l: any) => 
      l.name?.toLowerCase().includes(query) || 
      l.description?.toLowerCase().includes(query)
    )
  }
  if (selectedTags.value.length > 0) {
    result = result.filter((l: any) => 
      selectedTags.value.some(t => l.tags?.includes(t))
    )
  }
  return result.sort((a: any, b: any) => (b.downloads || 0) - (a.downloads || 0))
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
    <!-- Navigation provided by default layout -->

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
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500 font-mono text-sm">Loading layers...</p>
      </div>
      
      <div v-else class="space-y-4">
        <NuxtLink
          v-for="layer in filteredLayers"
          :key="layer.name"
          :to="`/layers/${encodeURIComponent(layer.name)}`"
          class="block dark-card p-6 hover:border-white/30 transition-colors group"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-sm font-bold group-hover:text-orange-500 transition-colors">{{ layer.name }}</h3>
                <span v-if="layer.official" class="text-[10px] font-mono text-orange-500 uppercase">Official</span>
              </div>
              <p class="text-xs text-gray-500 font-light">{{ layer.description }}</p>
            </div>
            <code class="text-[10px] font-mono text-gray-600">v{{ layer.version }}</code>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex gap-4 text-[10px] font-mono text-gray-600">
              <span>↓ {{ formatNumber(layer.downloads || 0) }}</span>
            </div>
            <div class="flex gap-1">
              <span v-for="tag in (layer.tags || [])" :key="tag" class="text-[10px] font-mono text-gray-600 bg-white/5 px-2 py-0.5">
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
