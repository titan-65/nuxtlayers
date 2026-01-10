<script setup lang="ts">
useHead({ title: 'Publisher Dashboard - NuxtLayers' })

// Use the auth-firebase layer composable
const { user, loading, isAdmin, init } = useFirebaseAuth()

// Dashboard data
const publishedLayers = ref<any[]>([])
const stats = ref({ totalLayers: 0, totalDownloads: 0, thisMonth: 0, platformLayerCount: 0 })
const dataLoading = ref(true)

// Fetch dashboard data when user is available
async function fetchDashboardData() {
  if (!user.value?.email) return
  
  try {
    dataLoading.value = true
    const response = await $fetch('/api/dashboard/stats', {
      query: { userId: user.value.email }
    })
    
    if (response.success) {
      publishedLayers.value = response.data.layers
      stats.value = response.data.stats
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    dataLoading.value = false
  }
}

// Redirect to login if not authenticated
onMounted(async () => {
  await init()
  if (!user.value) {
    navigateTo('/login')
  } else {
    await fetchDashboardData()
  }
})

// Watch for logout
watch(user, async (newUser) => {
  if (!newUser) {
    navigateTo('/login')
  } else {
    await fetchDashboardData()
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#0A0A0A] text-white selection:bg-orange-500 selection:text-black">
    <!-- Navigation -->
    <!-- Navigation provided by default layout -->

    <!-- Loading -->
    <div v-if="loading || dataLoading" class="flex items-center justify-center min-h-[50vh]">
      <div class="text-gray-500 font-mono text-sm">Loading dashboard...</div>
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
          <div class="text-[10px] font-mono text-gray-500 uppercase mb-2">Your Layers</div>
          <div class="text-3xl font-bold text-orange-500">{{ stats.totalLayers }}</div>
        </div>
        <div class="dark-card p-6">
          <div class="text-[10px] font-mono text-gray-500 uppercase mb-2">Total Downloads</div>
          <div class="text-3xl font-bold">{{ stats.totalDownloads.toLocaleString() }}</div>
        </div>
        <div class="dark-card p-6">
          <div class="text-[10px] font-mono text-gray-500 uppercase mb-2">This Month</div>
          <div class="text-3xl font-bold">{{ stats.thisMonth.toLocaleString() }}</div>
        </div>
      </div>

      <!-- Published Layers -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-bold uppercase tracking-wide text-orange-500">Your Published Layers</h2>
          <NuxtLink to="/publish" class="dark-btn text-xs">+ New Layer</NuxtLink>
        </div>

        <!-- Empty state -->
        <div v-if="publishedLayers.length === 0" class="dark-card p-8 text-center">
          <p class="text-gray-500 mb-4">You haven't published any layers yet.</p>
          <NuxtLink to="/publish" class="dark-btn text-xs">Publish Your First Layer</NuxtLink>
        </div>

        <!-- Layers list -->
        <div v-else class="dark-card divide-y divide-white/10">
          <div v-for="layer in publishedLayers" :key="layer.id" class="p-4 flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-sm font-bold">{{ layer.id }}</h3>
                <span class="text-[10px] font-mono text-green-500 uppercase">{{ layer.status }}</span>
              </div>
              <div class="text-[10px] font-mono text-gray-600">
                v{{ layer.version }} • ↓ {{ layer.downloads.toLocaleString() }} downloads
              </div>
            </div>
            <div class="flex items-center gap-2">
              <NuxtLink :to="`/layers/${encodeURIComponent(layer.id)}`" class="dark-btn-outline text-[10px] px-3 py-1">View</NuxtLink>
              <button class="dark-btn-outline text-[10px] px-3 py-1">Update</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin section (visible only to admins) -->
      <div v-if="isAdmin" class="mb-8">
        <h2 class="text-sm font-bold uppercase tracking-wide text-orange-500 mb-4">Platform Stats (Admin)</h2>
        <div class="dark-card p-6">
          <div class="text-[10px] font-mono text-gray-500 uppercase mb-2">Total Platform Layers</div>
          <div class="text-2xl font-bold">{{ stats.platformLayerCount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
