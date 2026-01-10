<script setup lang="ts">
useHead({
  title: 'Publish a Layer - NuxtLayers'
})

// Auth
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user, loading: authLoading } = storeToRefs(authStore)

onMounted(async () => {
  await authStore.initialize()
})

// Form state
const currentStep = ref(1)
const submitting = ref(false)
const success = ref(false)
const error = ref('')

const layerData = ref({
  name: '',
  description: '',
  version: '1.0.0',
  tags: '',
  githubUrl: '',
  readme: ''
})

// Generated GitHub URL
const generatedGithubUrl = computed(() => {
  const name = layerData.value.name.replace('@', '').replace('/', '-')
  return `github:${user.value?.email?.split('@')[0] || 'your-org'}/${name}`
})

// Preview JSON
const generatedJson = computed(() => {
  return JSON.stringify({
    name: layerData.value.name || '@org/layer-name',
    version: layerData.value.version,
    description: layerData.value.description || 'Layer description',
    tags: layerData.value.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
    githubUrl: layerData.value.githubUrl || generatedGithubUrl.value,
    author: { 
      name: user.value?.displayName || 'Your Name', 
      email: user.value?.email || 'you@example.com' 
    }
  }, null, 2)
})

// Submit to API
async function publishLayer() {
  if (!user.value) {
    error.value = 'Please sign in to publish a layer'
    return
  }

  error.value = ''
  submitting.value = true

  try {
    const tags = layerData.value.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
    
    const response = await $fetch('/api/layers/register', {
      method: 'POST',
      body: {
        name: layerData.value.name,
        description: layerData.value.description,
        version: layerData.value.version,
        tags,
        githubUrl: layerData.value.githubUrl || generatedGithubUrl.value,
        readme: layerData.value.readme,
        author: {
          name: user.value.displayName || 'Unknown',
          email: user.value.email
        }
      }
    })

    if (response.success) {
      success.value = true
      currentStep.value = 3
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to publish layer'
  } finally {
    submitting.value = false
  }
}

// Validation
const isStep1Valid = computed(() => 
  layerData.value.name && 
  layerData.value.name.includes('/') && 
  layerData.value.description &&
  layerData.value.version
)
</script>

<template>
  <div class="min-h-screen bg-[#0A0A0A] text-white selection:bg-orange-500 selection:text-black">
    <!-- Navigation provided by default layout -->

    <div class="max-w-3xl mx-auto px-6 py-12">
      <div class="dark-section-title mb-4">
        <span>Publishing</span>
      </div>
      <h1 class="text-3xl font-bold mb-2 tracking-tight">Publish a Layer</h1>
      <p class="text-gray-500 font-light text-sm mb-8">Register your Nuxt layer in the NuxtLayers registry.</p>

      <!-- Auth check -->
      <div v-if="authLoading" class="text-center py-12">
        <p class="text-gray-500 font-mono text-sm">Loading...</p>
      </div>

      <div v-else-if="!user" class="dark-card p-8 text-center mb-8">
        <p class="text-gray-400 mb-4">Sign in to publish layers to the registry.</p>
        <NuxtLink to="/login" class="dark-btn text-xs">Sign In with Google</NuxtLink>
      </div>

      <!-- Publishing form -->
      <template v-else>
        <!-- Progress steps -->
        <div class="flex gap-4 mb-12">
          <button
            v-for="step in 3"
            :key="step"
            @click="step <= 2 && (currentStep = step)"
            class="dark-card w-10 h-10 flex items-center justify-center text-xs font-bold transition-colors"
            :class="{
              'bg-orange-500 text-white': currentStep === step,
              'bg-green-500 text-white': success && step === 3
            }"
          >
            {{ step === 3 && success ? '✓' : `0${step}` }}
          </button>
        </div>

        <!-- Error message -->
        <div v-if="error" class="dark-card p-4 mb-6 border-red-500/50 bg-red-500/10">
          <p class="text-sm text-red-400">{{ error }}</p>
        </div>

        <!-- Step 1: Layer Details -->
        <div v-if="currentStep === 1" class="space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wide mb-4 text-orange-500">Layer Details</h2>
          
          <div class="dark-card p-6 space-y-4">
            <div>
              <label class="text-[10px] font-mono text-gray-400 uppercase block mb-2">Layer Name *</label>
              <input v-model="layerData.name" class="dark-input w-full" placeholder="@your-org/layer-name" />
              <p class="text-[10px] text-gray-600 mt-1">Format: @org/name</p>
            </div>
            
            <div>
              <label class="text-[10px] font-mono text-gray-400 uppercase block mb-2">Description *</label>
              <input v-model="layerData.description" class="dark-input w-full" placeholder="A brief description" />
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-[10px] font-mono text-gray-400 uppercase block mb-2">Version *</label>
                <input v-model="layerData.version" class="dark-input w-full" placeholder="1.0.0" />
              </div>
              <div>
                <label class="text-[10px] font-mono text-gray-400 uppercase block mb-2">Tags</label>
                <input v-model="layerData.tags" class="dark-input w-full" placeholder="auth, firebase" />
              </div>
            </div>
          </div>

          <div class="dark-card p-6">
            <div class="text-[10px] font-mono text-gray-400 uppercase mb-2">Preview</div>
            <pre class="font-mono text-xs text-gray-500 leading-relaxed overflow-x-auto">{{ generatedJson }}</pre>
          </div>

          <button @click="currentStep = 2" :disabled="!isStep1Valid" class="dark-btn" :class="{ 'opacity-50': !isStep1Valid }">
            Next: Connect Repository →
          </button>
        </div>

        <!-- Step 2: GitHub Repository -->
        <div v-if="currentStep === 2" class="space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wide mb-4 text-orange-500">GitHub Repository</h2>
          
          <div class="dark-card p-6 space-y-4">
            <div>
              <label class="text-[10px] font-mono text-gray-400 uppercase block mb-2">GitHub Source URL</label>
              <input v-model="layerData.githubUrl" class="dark-input w-full" :placeholder="generatedGithubUrl" />
              <p class="text-[10px] text-gray-600 mt-1">Format: github:user/repo/path/to/layer</p>
            </div>

            <div>
              <label class="text-[10px] font-mono text-gray-400 uppercase block mb-2">README (optional)</label>
              <textarea v-model="layerData.readme" class="dark-input w-full h-32 resize-none" placeholder="# My Layer..."></textarea>
            </div>
          </div>

          <div class="flex gap-4">
            <button @click="currentStep = 1" class="dark-btn-outline">← Back</button>
            <button @click="publishLayer" :disabled="submitting" class="dark-btn flex-1" :class="{ 'opacity-50': submitting }">
              {{ submitting ? 'Publishing...' : 'Publish Layer →' }}
            </button>
          </div>
        </div>

        <!-- Step 3: Success -->
        <div v-if="currentStep === 3 && success" class="space-y-6">
          <div class="dark-card p-8 text-center">
            <div class="text-4xl mb-4">🎉</div>
            <h2 class="text-xl font-bold mb-2">Layer Published!</h2>
            <p class="text-gray-500 mb-6">{{ layerData.name }} is now available.</p>
            
            <div class="terminal-window mb-6">
              <div class="terminal-header">
                <div class="terminal-dot bg-red-500"></div>
                <div class="terminal-dot bg-yellow-500"></div>
                <div class="terminal-dot bg-green-500"></div>
              </div>
              <div class="terminal-body">
                <code><span class="text-orange-500">$</span> npx nuxt-layers add {{ layerData.name }}</code>
              </div>
            </div>

            <div class="flex gap-4 justify-center">
              <NuxtLink :to="`/layers/${encodeURIComponent(layerData.name)}`" class="dark-btn text-xs">View Layer</NuxtLink>
              <NuxtLink to="/dashboard" class="dark-btn-outline text-xs">Dashboard</NuxtLink>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
