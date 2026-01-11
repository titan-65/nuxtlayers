<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

useHead({
    title: '@vantol/analytics - NuxtLayers'
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
                        <span>Premium Layer</span>
                    </div>

                    <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                        @vantol/<span class="text-orange-500">analytics</span>
                    </h1>

                    <p class="text-gray-500 mb-8 max-w-md font-light leading-relaxed">
                        Privacy-focused analytics dashboard with real-time tracking. GDPR-compliant, no cookies required.
                    </p>

                    <div class="flex items-center gap-4 mb-8">
                        <span class="text-3xl font-bold text-white">$79</span>
                        <span class="text-sm text-gray-500">one-time purchase</span>
                    </div>

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
                                <code class="text-white">npx nuxt-layers add @vantol/analytics --license YOUR_KEY</code>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <NuxtLink to="/pricing" class="dark-btn">
                            Get License →
                        </NuxtLink>
                        <NuxtLink to="/docs" class="dark-btn-outline">
                            View Docs
                        </NuxtLink>
                    </div>
                </div>

                <!-- Right: Features Grid -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="dark-card p-5">
                        <div class="text-[10px] font-mono text-green-500 uppercase mb-3">Privacy</div>
                        <h3 class="font-semibold mb-2">No Cookies</h3>
                        <p class="text-sm text-gray-500 font-light">Track without cookie banners or consent popups</p>
                    </div>
                    <div class="dark-card p-5">
                        <div class="text-[10px] font-mono text-green-500 uppercase mb-3">Compliance</div>
                        <h3 class="font-semibold mb-2">GDPR Ready</h3>
                        <p class="text-sm text-gray-500 font-light">Privacy-first design for EU compliance</p>
                    </div>
                    <div class="dark-card p-5">
                        <div class="text-[10px] font-mono text-orange-500 uppercase mb-3">Feature</div>
                        <h3 class="font-semibold mb-2">Real-Time</h3>
                        <p class="text-sm text-gray-500 font-light">Live visitor tracking and page views</p>
                    </div>
                    <div class="dark-card p-5">
                        <div class="text-[10px] font-mono text-orange-500 uppercase mb-3">Feature</div>
                        <h3 class="font-semibold mb-2">Dashboard</h3>
                        <p class="text-sm text-gray-500 font-light">Beautiful analytics UI included</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Metrics Section -->
        <section class="min-h-screen flex flex-col justify-center px-6 border-t border-white/10">
            <div class="max-w-7xl mx-auto w-full py-20">
                <div class="dark-section-title mb-4">
                    <span>Metrics</span>
                </div>
                <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-12">
                    Track what matters
                </h2>

                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="dark-card p-5">
                        <div class="text-[10px] font-mono text-gray-600 uppercase mb-2">Metric</div>
                        <h3 class="font-semibold text-orange-500">Page Views</h3>
                        <p class="text-sm text-gray-500 mt-2 font-light">Track visits across your site</p>
                    </div>
                    <div class="dark-card p-5">
                        <div class="text-[10px] font-mono text-gray-600 uppercase mb-2">Metric</div>
                        <h3 class="font-semibold text-orange-500">Visitors</h3>
                        <p class="text-sm text-gray-500 mt-2 font-light">Unique visitors without fingerprinting</p>
                    </div>
                    <div class="dark-card p-5">
                        <div class="text-[10px] font-mono text-gray-600 uppercase mb-2">Metric</div>
                        <h3 class="font-semibold text-orange-500">Sessions</h3>
                        <p class="text-sm text-gray-500 mt-2 font-light">Session duration and bounce rate</p>
                    </div>
                    <div class="dark-card p-5">
                        <div class="text-[10px] font-mono text-gray-600 uppercase mb-2">Metric</div>
                        <h3 class="font-semibold text-orange-500">Events</h3>
                        <p class="text-sm text-gray-500 mt-2 font-light">Custom event tracking</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- API Section -->
        <section class="min-h-screen flex flex-col justify-center px-6 border-t border-white/10">
            <div class="max-w-7xl mx-auto w-full py-20">
                <div class="dark-section-title mb-4">
                    <span>Usage</span>
                </div>
                <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-12">
                    Simple integration
                </h2>

                <div class="grid lg:grid-cols-2 gap-8">
                    <!-- Auto Tracking -->
                    <div class="terminal-window">
                        <div class="terminal-header">
                            <div class="terminal-dot bg-red-500"></div>
                            <div class="terminal-dot bg-yellow-500"></div>
                            <div class="terminal-dot bg-green-500"></div>
                            <span class="text-[10px] font-mono text-gray-500 ml-2">AUTO TRACKING</span>
                        </div>
                        <div class="terminal-body">
                            <pre class="text-gray-400"><code>// Analytics auto-tracks page views
// Just install the layer!
// No code changes needed</code></pre>
                        </div>
                    </div>

                    <!-- Custom Events -->
                    <div class="terminal-window">
                        <div class="terminal-header">
                            <div class="terminal-dot bg-red-500"></div>
                            <div class="terminal-dot bg-yellow-500"></div>
                            <div class="terminal-dot bg-green-500"></div>
                            <span class="text-[10px] font-mono text-gray-500 ml-2">CUSTOM EVENTS</span>
                        </div>
                        <div class="terminal-body">
                            <pre class="text-gray-400"><code>const { trackEvent } = useAnalytics()

trackEvent('signup', {
  plan: 'pro',
  source: 'landing'
})</code></pre>
                        </div>
                    </div>
                </div>

                <div class="mt-12 text-center">
                    <NuxtLink to="/pricing" class="dark-btn">
                        Get License →
                    </NuxtLink>
                </div>
            </div>
        </section>
    </div>
</template>
