<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

useHead({
    title: '@vantol/saas-kit - NuxtLayers'
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
                        @vantol/<span class="text-orange-500">saas-kit</span>
                    </h1>

                    <p class="text-gray-500 mb-8 max-w-md font-light leading-relaxed">
                        Complete SaaS foundation with teams, billing, onboarding, and dashboard. Ship your product in days, not months.
                    </p>

                    <div class="flex items-center gap-4 mb-8">
                        <span class="text-3xl font-bold text-white">$199</span>
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
                                <code class="text-white">npx nuxt-layers add @vantol/saas-kit --license YOUR_KEY</code>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <NuxtLink to="/app" class="dark-btn">
                            Try Live Demo →
                        </NuxtLink>
                        <NuxtLink to="/pricing" class="dark-btn-outline">
                            Get License
                        </NuxtLink>
                    </div>
                </div>

                <!-- Right: Features Grid -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="dark-card p-5">
                        <div class="text-[10px] font-mono text-orange-500 uppercase mb-3">Module</div>
                        <h3 class="font-semibold mb-2">Team Management</h3>
                        <p class="text-sm text-gray-500 font-light">Invite members, roles, and permissions out of the box</p>
                    </div>
                    <div class="dark-card p-5">
                        <div class="text-[10px] font-mono text-orange-500 uppercase mb-3">Module</div>
                        <h3 class="font-semibold mb-2">Billing & Subscriptions</h3>
                        <p class="text-sm text-gray-500 font-light">Stripe integration with plans, trials, and invoices</p>
                    </div>
                    <div class="dark-card p-5">
                        <div class="text-[10px] font-mono text-orange-500 uppercase mb-3">Module</div>
                        <h3 class="font-semibold mb-2">Dashboard</h3>
                        <p class="text-sm text-gray-500 font-light">Beautiful admin dashboard with stats and activity</p>
                    </div>
                    <div class="dark-card p-5">
                        <div class="text-[10px] font-mono text-orange-500 uppercase mb-3">Module</div>
                        <h3 class="font-semibold mb-2">Onboarding</h3>
                        <p class="text-sm text-gray-500 font-light">Guided setup flow for new users and teams</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- What's Included Section -->
        <section class="min-h-screen flex flex-col justify-center px-6 border-t border-white/10">
            <div class="max-w-7xl mx-auto w-full py-20">
                <div class="dark-section-title mb-4">
                    <span>Includes</span>
                </div>
                <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-12">
                    Production-ready code
                </h2>

                <div class="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div class="dark-card p-4 text-center">
                        <div class="text-2xl font-bold text-orange-500 mb-1">15+</div>
                        <div class="text-[10px] font-mono text-gray-500 uppercase">Components</div>
                    </div>
                    <div class="dark-card p-4 text-center">
                        <div class="text-2xl font-bold text-orange-500 mb-1">8</div>
                        <div class="text-[10px] font-mono text-gray-500 uppercase">API Routes</div>
                    </div>
                    <div class="dark-card p-4 text-center">
                        <div class="text-2xl font-bold text-orange-500 mb-1">6</div>
                        <div class="text-[10px] font-mono text-gray-500 uppercase">Pages</div>
                    </div>
                    <div class="dark-card p-4 text-center">
                        <div class="text-2xl font-bold text-orange-500 mb-1">4</div>
                        <div class="text-[10px] font-mono text-gray-500 uppercase">Composables</div>
                    </div>
                    <div class="dark-card p-4 text-center">
                        <div class="text-2xl font-bold text-orange-500 mb-1">∞</div>
                        <div class="text-[10px] font-mono text-gray-500 uppercase">Updates</div>
                    </div>
                    <div class="dark-card p-4 text-center">
                        <div class="text-2xl font-bold text-orange-500 mb-1">1yr</div>
                        <div class="text-[10px] font-mono text-gray-500 uppercase">Support</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Demo Section -->
        <section class="min-h-screen flex flex-col justify-center px-6 border-t border-white/10">
            <div class="max-w-7xl mx-auto w-full py-20 text-center">
                <div class="dark-section-title mb-4 justify-center">
                    <span>Demo</span>
                </div>
                <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                    See it in action
                </h2>
                <p class="text-gray-500 font-light mb-12 max-w-md mx-auto">
                    Explore the full SaaS dashboard with teams, billing, and all features live.
                </p>

                <NuxtLink to="/app" class="dark-btn">
                    Open Dashboard Demo →
                </NuxtLink>
            </div>
        </section>
    </div>
</template>
