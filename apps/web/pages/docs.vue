<script setup lang="ts">
useHead({
  title: 'Documentation - NuxtLayers'
})
</script>

<template>
  <div class="min-h-screen bg-[#0A0A0A] text-white selection:bg-orange-500 selection:text-black">
    <!-- Navigation provided by default layout -->

    <div class="max-w-4xl mx-auto px-6 py-12">
      <div class="dark-section-title mb-4">
        <span>Documentation</span>
      </div>
      <h1 class="text-3xl font-bold mb-2 tracking-tight">Getting Started</h1>
      <p class="text-gray-500 font-light text-sm mb-12">Learn how to use NuxtLayers to supercharge your Nuxt applications.</p>

      <!-- Quick Start -->
      <section class="mb-12">
        <h2 class="text-sm font-bold uppercase tracking-wide mb-6 text-orange-500">Quick Start</h2>
        
        <div class="space-y-4">
          <div class="terminal-window">
            <div class="terminal-header">
              <div class="terminal-dot bg-red-500"></div>
              <div class="terminal-dot bg-yellow-500"></div>
              <div class="terminal-dot bg-green-500"></div>
              <span class="text-[10px] font-mono text-gray-500 ml-2">STEP 01 — INSTALL CLI</span>
            </div>
            <div class="terminal-body">
              <code class="text-orange-500">$</code> npm install -g nuxt-layers
            </div>
          </div>

          <div class="terminal-window">
            <div class="terminal-header">
              <div class="terminal-dot bg-red-500"></div>
              <div class="terminal-dot bg-yellow-500"></div>
              <div class="terminal-dot bg-green-500"></div>
              <span class="text-[10px] font-mono text-gray-500 ml-2">STEP 02 — ADD LAYER</span>
            </div>
            <div class="terminal-body">
              <code class="text-orange-500">$</code> npx nuxt-layers add @vantol/auth-firebase
            </div>
          </div>

          <div class="dark-card p-5">
            <div class="text-[10px] font-mono text-gray-500 uppercase mb-2">Step 03 — Start using</div>
            <p class="text-xs text-gray-400 font-light">The layer is automatically added to your <code class="bg-white/10 px-1 py-0.5 text-orange-500">nuxt.config.ts</code> and ready to use!</p>
          </div>
        </div>
      </section>

      <!-- CLI Commands -->
      <section class="mb-12">
        <h2 class="text-sm font-bold uppercase tracking-wide mb-6 text-orange-500">CLI Commands</h2>

        <div class="dark-card divide-y divide-white/10">
          <div class="p-4">
            <code class="font-mono text-xs text-white">nuxt-layers add &lt;layer&gt;</code>
            <p class="text-[10px] text-gray-500 mt-1">Add a layer to your project</p>
          </div>
          <div class="p-4">
            <code class="font-mono text-xs text-white">nuxt-layers list</code>
            <p class="text-[10px] text-gray-500 mt-1">List installed layers</p>
          </div>
          <div class="p-4">
            <code class="font-mono text-xs text-white">nuxt-layers search &lt;query&gt;</code>
            <p class="text-[10px] text-gray-500 mt-1">Search for layers in the registry</p>
          </div>
          <div class="p-4">
            <code class="font-mono text-xs text-white">nuxt-layers update</code>
            <p class="text-[10px] text-gray-500 mt-1">Update all installed layers</p>
          </div>
          <div class="p-4">
            <code class="font-mono text-xs text-white">nuxt-layers remove &lt;layer&gt;</code>
            <p class="text-[10px] text-gray-500 mt-1">Remove a layer from your project</p>
          </div>
        </div>
      </section>

      <!-- Layer Structure -->
      <section class="mb-12">
        <h2 class="text-sm font-bold uppercase tracking-wide mb-6 text-orange-500">Layer Structure</h2>

        <div class="terminal-window">
          <div class="terminal-header">
            <div class="terminal-dot bg-red-500"></div>
            <div class="terminal-dot bg-yellow-500"></div>
            <div class="terminal-dot bg-green-500"></div>
            <span class="text-[10px] font-mono text-gray-500 ml-2">FILE STRUCTURE</span>
          </div>
          <div class="terminal-body leading-relaxed">
            <pre class="text-gray-400">my-layer/
├── nuxt.config.ts     <span class="text-gray-600"># Layer configuration</span>
├── layer.json         <span class="text-gray-600"># Registry metadata</span>
├── components/        <span class="text-gray-600"># Auto-imported components</span>
├── composables/       <span class="text-gray-600"># Auto-imported composables</span>
├── pages/             <span class="text-gray-600"># Optional pages</span>
├── server/            <span class="text-gray-600"># Server routes</span>
└── README.md          <span class="text-gray-600"># Documentation</span></pre>
          </div>
        </div>
      </section>

      <!-- Publishing -->
      <section>
        <h2 class="text-sm font-bold uppercase tracking-wide mb-6 text-orange-500">Publishing a Layer</h2>

        <div class="dark-card p-5 mb-6">
          <ol class="space-y-3 text-xs text-gray-400">
            <li><span class="text-orange-500 font-bold">1.</span> Create a <code class="bg-white/10 px-1 py-0.5">layer.json</code> with your layer metadata</li>
            <li><span class="text-orange-500 font-bold">2.</span> Sign in to your NuxtLayers account</li>
            <li><span class="text-orange-500 font-bold">3.</span> Run <code class="bg-white/10 px-1 py-0.5">nuxt-layers publish</code> in your layer directory</li>
          </ol>
        </div>

        <NuxtLink to="/publish" class="dark-btn">
          Publish Your First Layer →
        </NuxtLink>
      </section>
    </div>
  </div>
</template>
