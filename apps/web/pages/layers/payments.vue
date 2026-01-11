<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

useHead({
    title: '@vantol/payments - NuxtLayers'
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
                        @vantol/<span class="text-orange-500">payments</span>
                    </h1>

                    <p class="text-gray-500 mb-8 max-w-md font-light leading-relaxed">
                        Stripe and Polar.sh integration with checkout, subscriptions, and portals. Accept payments in minutes.
                    </p>

                    <div class="flex items-center gap-4 mb-8">
                        <span class="text-3xl font-bold text-white">$99</span>
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
                                <code class="text-white">npx nuxt-layers add @vantol/payments --license YOUR_KEY</code>
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

                <!-- Right: Providers -->
                <div class="space-y-4">
                    <div class="dark-card p-6 flex items-center gap-6">
                        <div class="w-12 h-12 bg-[#635BFF] rounded flex items-center justify-center">
                            <span class="text-xl font-bold text-white">S</span>
                        </div>
                        <div>
                            <h3 class="font-semibold mb-1">Stripe</h3>
                            <p class="text-sm text-gray-500 font-light">Full checkout, subscriptions, and customer portal</p>
                        </div>
                        <span class="ml-auto text-[10px] font-mono text-green-500 border border-green-500 px-2 py-0.5">INTEGRATED</span>
                    </div>
                    <div class="dark-card p-6 flex items-center gap-6">
                        <div class="w-12 h-12 bg-[#0062FF] rounded flex items-center justify-center">
                            <span class="text-xl font-bold text-white">P</span>
                        </div>
                        <div>
                            <h3 class="font-semibold mb-1">Polar.sh</h3>
                            <p class="text-sm text-gray-500 font-light">Open-source monetization for developers</p>
                        </div>
                        <span class="ml-auto text-[10px] font-mono text-green-500 border border-green-500 px-2 py-0.5">INTEGRATED</span>
                    </div>
                    <div class="dark-card p-6 flex items-center gap-6">
                        <div class="w-12 h-12 bg-[#0A0A0A] rounded flex items-center justify-center border border-white/20">
                            <span class="text-xl font-bold text-white">L</span>
                        </div>
                        <div>
                            <h3 class="font-semibold mb-1">License Keys</h3>
                            <p class="text-sm text-gray-500 font-light">Generate and validate software licenses</p>
                        </div>
                        <span class="ml-auto text-[10px] font-mono text-green-500 border border-green-500 px-2 py-0.5">INCLUDED</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="min-h-screen flex flex-col justify-center px-6 border-t border-white/10">
            <div class="max-w-7xl mx-auto w-full py-20">
                <div class="dark-section-title mb-4">
                    <span>Features</span>
                </div>
                <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-12">
                    Everything for monetization
                </h2>

                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="dark-card p-5">
                        <div class="text-[10px] font-mono text-gray-600 uppercase mb-2">Composable</div>
                        <code class="text-orange-500 font-mono">usePayments()</code>
                        <p class="text-sm text-gray-500 mt-2 font-light">Manage subscriptions and checkout</p>
                    </div>
                    <div class="dark-card p-5">
                        <div class="text-[10px] font-mono text-gray-600 uppercase mb-2">Component</div>
                        <code class="text-orange-500 font-mono">PricingTable</code>
                        <p class="text-sm text-gray-500 mt-2 font-light">Beautiful pricing display</p>
                    </div>
                    <div class="dark-card p-5">
                        <div class="text-[10px] font-mono text-gray-600 uppercase mb-2">API</div>
                        <code class="text-orange-500 font-mono">/api/checkout</code>
                        <p class="text-sm text-gray-500 mt-2 font-light">Create checkout sessions</p>
                    </div>
                    <div class="dark-card p-5">
                        <div class="text-[10px] font-mono text-gray-600 uppercase mb-2">Webhook</div>
                        <code class="text-orange-500 font-mono">/api/webhooks</code>
                        <p class="text-sm text-gray-500 mt-2 font-light">Handle payment events</p>
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
