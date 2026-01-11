<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

useHead({
    title: '@vantol/waitlist - NuxtLayers'
})
</script>

<template>
    <div class="min-h-screen bg-[#0A0A0A] text-white">
        <!-- Hero Section -->
        <section class="min-h-screen flex items-center px-6 pt-20">
            <div class="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
                <!-- Left: Content -->
                <div>
                    <div class="dark-section-title mb-6">
                        <span>Free Layer</span>
                    </div>

                    <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                        @vantol/<span class="text-orange-500">waitlist</span>
                    </h1>

                    <p class="text-gray-500 mb-10 max-w-md font-light leading-relaxed">
                        Pre-launch waitlist with viral referral tracking. Build hype and grow your audience before you launch.
                    </p>

                    <!-- Terminal Window -->
                    <div class="terminal-window mb-8 max-w-md">
                        <div class="terminal-header">
                            <div class="terminal-dot bg-red-500"></div>
                            <div class="terminal-dot bg-yellow-500"></div>
                            <div class="terminal-dot bg-green-500"></div>
                            <span class="text-[10px] font-mono text-gray-500 ml-2">TERMINAL / ZSH</span>
                        </div>
                        <div class="terminal-body">
                            <div class="text-gray-500 mb-2">~/my-nuxt-app <span class="text-orange-500">(main)</span></div>
                            <div class="flex items-center gap-2">
                                <span class="text-orange-500">$</span>
                                <code class="text-white">npx nuxt-layers add @vantol/waitlist</code>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <NuxtLink to="/waitlist" class="dark-btn">
                            Try Live Demo →
                        </NuxtLink>
                        <button 
                            @click="navigator.clipboard.writeText('npx nuxt-layers add @vantol/waitlist')"
                            class="dark-btn-outline"
                        >
                            Copy Command
                        </button>
                    </div>
                </div>

                <!-- Right: Features Grid -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="dark-card p-5">
                        <div class="text-[10px] font-mono text-orange-500 uppercase mb-3">Feature</div>
                        <h3 class="font-semibold mb-2">Email Collection</h3>
                        <p class="text-sm text-gray-500 font-light">Beautiful signup forms that convert visitors into leads</p>
                    </div>
                    <div class="dark-card p-5">
                        <div class="text-[10px] font-mono text-orange-500 uppercase mb-3">Feature</div>
                        <h3 class="font-semibold mb-2">Referral Tracking</h3>
                        <p class="text-sm text-gray-500 font-light">Unique referral codes and viral loop mechanics</p>
                    </div>
                    <div class="dark-card p-5">
                        <div class="text-[10px] font-mono text-orange-500 uppercase mb-3">Feature</div>
                        <h3 class="font-semibold mb-2">Leaderboard</h3>
                        <p class="text-sm text-gray-500 font-light">Gamified experience with top referrer rankings</p>
                    </div>
                    <div class="dark-card p-5">
                        <div class="text-[10px] font-mono text-orange-500 uppercase mb-3">Feature</div>
                        <h3 class="font-semibold mb-2">Position Tracking</h3>
                        <p class="text-sm text-gray-500 font-light">Show users their waitlist position in real-time</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Code Examples Section -->
        <section class="min-h-screen flex flex-col justify-center px-6 border-t border-white/10">
            <div class="max-w-7xl mx-auto w-full py-20">
                <div class="dark-section-title mb-4">
                    <span>Usage</span>
                </div>
                <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-12">
                    Simple to integrate
                </h2>

                <div class="grid lg:grid-cols-2 gap-8">
                    <!-- Component Usage -->
                    <div class="terminal-window">
                        <div class="terminal-header">
                            <div class="terminal-dot bg-red-500"></div>
                            <div class="terminal-dot bg-yellow-500"></div>
                            <div class="terminal-dot bg-green-500"></div>
                            <span class="text-[10px] font-mono text-gray-500 ml-2">COMPONENT</span>
                        </div>
                        <div class="terminal-body">
                            <pre class="text-gray-400"><code>&lt;WaitlistForm
  title="Get Early Access"
  :show-referral="true"
  :show-position="true"
/&gt;</code></pre>
                        </div>
                    </div>

                    <!-- Composable Usage -->
                    <div class="terminal-window">
                        <div class="terminal-header">
                            <div class="terminal-dot bg-red-500"></div>
                            <div class="terminal-dot bg-yellow-500"></div>
                            <div class="terminal-dot bg-green-500"></div>
                            <span class="text-[10px] font-mono text-gray-500 ml-2">COMPOSABLE</span>
                        </div>
                        <div class="terminal-body">
                            <pre class="text-gray-400"><code>const { 
  joinWaitlist, 
  referralLink,
  entry 
} = useWaitlist()

await joinWaitlist(email)</code></pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- What's Included -->
        <section class="min-h-screen flex flex-col justify-center px-6 border-t border-white/10">
            <div class="max-w-7xl mx-auto w-full py-20">
                <div class="dark-section-title mb-4">
                    <span>Includes</span>
                </div>
                <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-12">
                    Everything you need
                </h2>

                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="dark-card p-6">
                        <div class="text-[10px] font-mono text-gray-600 uppercase mb-2">Component</div>
                        <code class="text-orange-500 font-mono">WaitlistForm</code>
                    </div>
                    <div class="dark-card p-6">
                        <div class="text-[10px] font-mono text-gray-600 uppercase mb-2">Composable</div>
                        <code class="text-orange-500 font-mono">useWaitlist()</code>
                    </div>
                    <div class="dark-card p-6">
                        <div class="text-[10px] font-mono text-gray-600 uppercase mb-2">API</div>
                        <code class="text-orange-500 font-mono">/api/waitlist/join</code>
                    </div>
                    <div class="dark-card p-6">
                        <div class="text-[10px] font-mono text-gray-600 uppercase mb-2">Page</div>
                        <code class="text-orange-500 font-mono">/waitlist</code>
                    </div>
                </div>

                <div class="mt-12 text-center">
                    <NuxtLink to="/waitlist" class="dark-btn">
                        Try Live Demo →
                    </NuxtLink>
                </div>
            </div>
        </section>
    </div>
</template>
