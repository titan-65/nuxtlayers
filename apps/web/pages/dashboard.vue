<script setup lang="ts">
useHead({ title: 'Publisher Dashboard - NuxtLayers' })

// Use the auth-firebase layer composable
const { user, loading, isAdmin, init } = useFirebaseAuth()

// Redirect to login if not authenticated
onMounted(async () => {
  await init()
  if (!user.value) {
    navigateTo('/login')
  }
})

// Watch for logout
watch(user, (newUser) => {
  if (!newUser) {
    navigateTo('/login')
  }
})

const publishedLayers = ref([
  { id: '@vantol/auth-firebase', version: '1.0.0', downloads: 2400, status: 'published' },
  { id: '@vantol/blog', version: '1.0.0', downloads: 1800, status: 'published' }
])

const stats = ref({ totalLayers: 2, totalDownloads: 4200, thisMonth: 856 })
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
          <NuxtLink to="/dashboard" class="text-xs font-mono text-white uppercase">Dashboard</NuxtLink>
          <NuxtLink to="/account" class="text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase">Account</NuxtLink>
          
          <!-- User avatar -->
          <div v-if="user" class="flex items-center gap-2">
            <img 
              v-if="user.photoURL" 
              :src="user.photoURL" 
              :alt="user.displayName || 'User'" 
              class="w-6 h-6 rounded-full"
            />
            <span v-if="isAdmin" class="text-[10px] font-mono text-orange-500 uppercase">Admin</span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center min-h-[50vh]">
      <div class="text-gray-500">Loading...</div>
    </div>

    <!-- Content -->
    <div v-else-if="user" class="max-w-6xl mx-auto px-6 py-12">
      <div class="dark-section-title mb-4">
        <span>Publisher Dashboard</span>
      </div>
      <h1 class="text-3xl font-bold mb-2 tracking-tight">
        Welcome back, {{ user.displayName?.split(' ')[0] || 'Publisher' }}
      </h1>
      <p class="text-gray-500 font-light text-sm mb-8">Manage your published layers and view analytics.</p>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 mb-12">
        <div class="dark-card p-6">
          <div class="text-[10px] font-mono text-gray-500 uppercase mb-2">Total Layers</div>
          <div class="text-3xl font-bold text-orange-500">{{ stats.totalLayers }}</div>
        </div>
        <div class="dark-card p-6">
          <div class="text-[10px] font-mono text-gray-500 uppercase mb-2">Total Downloads</div>
          <div class="text-3xl font-bold">{{ stats.totalDownloads.toLocaleString() }}</div>
        </div>
        <div class="dark-card p-6">
          <div class="text-[10px] font-mono text-gray-500 uppercase mb-2">This Month</div>
          <div class="text-3xl font-bold">{{ stats.thisMonth }}</div>
        </div>
      </div>

      <!-- Published Layers -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-bold uppercase tracking-wide text-orange-500">Published Layers</h2>
          <NuxtLink to="/publish" class="dark-btn text-xs">+ New Layer</NuxtLink>
        </div>

        <div class="dark-card divide-y divide-white/10">
          <div v-for="layer in publishedLayers" :key="layer.id" class="p-4 flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-sm font-bold">{{ layer.id }}</h3>
                <span class="text-[10px] font-mono text-green-500 uppercase">{{ layer.status }}</span>
              </div>
              <div class="text-[10px] font-mono text-gray-600">
                v{{ layer.version }} • ↓ {{ layer.downloads }} downloads
              </div>
            </div>
            <div class="flex items-center gap-2">
              <NuxtLink :to="`/layers/${encodeURIComponent(layer.id)}`" class="dark-btn-outline text-[10px] px-3 py-1">View</NuxtLink>
              <button class="dark-btn-outline text-[10px] px-3 py-1">Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
