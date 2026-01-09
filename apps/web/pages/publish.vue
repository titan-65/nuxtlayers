<script setup lang="ts">
useHead({
  title: 'Publish a Layer - NuxtLayers'
})

const currentStep = ref(1)
const layerData = ref({
  name: '',
  description: '',
  version: '1.0.0',
  tags: ''
})

const generatedJson = computed(() => {
  return JSON.stringify({
    name: layerData.value.name || '@org/layer-name',
    version: layerData.value.version,
    description: layerData.value.description || 'Layer description',
    tags: layerData.value.tags.split(',').map(t => t.trim()).filter(Boolean),
    dependencies: [],
    author: { name: 'Your Name', email: 'you@example.com' }
  }, null, 2)
})
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
          <NuxtLink to="/layers" class="text-xs font-mono text-gray-500 hover:text-black transition-colors uppercase">Browse</NuxtLink>
          <NuxtLink to="/docs" class="text-xs font-mono text-gray-500 hover:text-black transition-colors uppercase">Docs</NuxtLink>
          <NuxtLink to="/publish" class="text-xs font-mono text-black uppercase">Publish</NuxtLink>
        </div>
      </div>
    </nav>

    <div class="max-w-3xl mx-auto px-6 py-12">
      <div class="wireframe-section-title mb-4">
        <span>Publishing</span>
      </div>
      <h1 class="text-3xl font-bold mb-2 tracking-tight">Publish a Layer</h1>
      <p class="text-gray-500 font-light text-sm mb-12">Share your Nuxt layer with the community.</p>

      <!-- Steps -->
      <div class="flex gap-4 mb-12">
        <button
          v-for="step in 3"
          :key="step"
          @click="currentStep = step"
          class="wireframe-card w-10 h-10 flex items-center justify-center text-xs font-bold transition-colors"
          :class="currentStep === step ? 'bg-black text-white' : ''"
        >
          0{{ step }}
        </button>
      </div>

      <!-- Step 1: Create layer.json -->
      <div v-if="currentStep === 1" class="space-y-6">
        <h2 class="text-sm font-bold uppercase tracking-wide mb-4">Create layer.json</h2>
        
        <div class="wireframe-card p-6 space-y-4">
          <div>
            <label class="text-[10px] font-mono text-gray-400 uppercase block mb-2">Layer Name</label>
            <input v-model="layerData.name" class="wireframe-input w-full" placeholder="@org/layer-name" />
          </div>
          
          <div>
            <label class="text-[10px] font-mono text-gray-400 uppercase block mb-2">Description</label>
            <input v-model="layerData.description" class="wireframe-input w-full" placeholder="A brief description of your layer" />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-mono text-gray-400 uppercase block mb-2">Version</label>
              <input v-model="layerData.version" class="wireframe-input w-full" placeholder="1.0.0" />
            </div>
            <div>
              <label class="text-[10px] font-mono text-gray-400 uppercase block mb-2">Tags (comma separated)</label>
              <input v-model="layerData.tags" class="wireframe-input w-full" placeholder="auth, firebase, sso" />
            </div>
          </div>
        </div>

        <div class="wireframe-card p-6">
          <div class="text-[10px] font-mono text-gray-400 uppercase mb-2">Generated layer.json</div>
          <pre class="font-mono text-xs text-gray-600 leading-relaxed">{{ generatedJson }}</pre>
        </div>

        <button @click="currentStep = 2" class="wireframe-btn">
          Next: Prepare Files →
        </button>
      </div>

      <!-- Step 2: Prepare Files -->
      <div v-if="currentStep === 2" class="space-y-6">
        <h2 class="text-sm font-bold uppercase tracking-wide mb-4">Prepare Your Layer</h2>
        
        <div class="wireframe-card p-6">
          <div class="text-[10px] font-mono text-gray-400 uppercase mb-4">Required Structure</div>
          <pre class="font-mono text-xs text-gray-500 leading-relaxed">your-layer/
├── nuxt.config.ts     # Layer configuration
├── layer.json         # Registry metadata
├── components/        # Auto-imported components
├── composables/       # Auto-imported composables
└── README.md          # Documentation</pre>
        </div>

        <div class="wireframe-card p-6">
          <h3 class="text-sm font-bold mb-3">Checklist</h3>
          <ul class="space-y-2 text-xs text-gray-500">
            <li class="flex items-center gap-2"><span class="w-4 h-4 wireframe-card flex items-center justify-center text-[10px]">✓</span> layer.json with metadata</li>
            <li class="flex items-center gap-2"><span class="w-4 h-4 wireframe-card flex items-center justify-center text-[10px]">✓</span> nuxt.config.ts exports</li>
            <li class="flex items-center gap-2"><span class="w-4 h-4 wireframe-card flex items-center justify-center text-[10px]">✓</span> README.md documentation</li>
            <li class="flex items-center gap-2"><span class="w-4 h-4 wireframe-card flex items-center justify-center text-[10px]">✓</span> Components or composables</li>
          </ul>
        </div>

        <div class="flex gap-4">
          <button @click="currentStep = 1" class="wireframe-btn-outline">← Back</button>
          <button @click="currentStep = 3" class="wireframe-btn">Next: Publish →</button>
        </div>
      </div>

      <!-- Step 3: Publish -->
      <div v-if="currentStep === 3" class="space-y-6">
        <h2 class="text-sm font-bold uppercase tracking-wide mb-4">Publish Your Layer</h2>
        
        <div class="wireframe-card p-6">
          <div class="text-[10px] font-mono text-gray-400 uppercase mb-2">Run this command</div>
          <code class="block bg-gray-100 p-3 font-mono text-xs">npx nuxt-layers publish</code>
        </div>

        <div class="wireframe-card p-6">
          <h3 class="text-sm font-bold mb-3">What happens next</h3>
          <ol class="space-y-2 text-xs text-gray-500">
            <li><span class="font-bold text-black">1.</span> Your layer is validated</li>
            <li><span class="font-bold text-black">2.</span> A tarball is created and uploaded</li>
            <li><span class="font-bold text-black">3.</span> Metadata is added to the registry</li>
            <li><span class="font-bold text-black">4.</span> Layer becomes available for install</li>
          </ol>
        </div>

        <div class="flex gap-4">
          <button @click="currentStep = 2" class="wireframe-btn-outline">← Back</button>
          <NuxtLink to="/docs" class="wireframe-btn">Read Full Docs</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
