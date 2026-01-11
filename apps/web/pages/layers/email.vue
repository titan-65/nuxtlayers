<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

useHead({
    title: '@vantol/email - NuxtLayers'
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
                        @vantol/<span class="text-orange-500">email</span>
                    </h1>

                    <p class="text-gray-500 mb-10 max-w-md font-light leading-relaxed">
                        Beautiful transactional emails with Resend and Sendgrid integration. Send professional emails in minutes.
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
                                <code class="text-white">npx nuxt-layers add @vantol/email</code>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <button 
                            @click="navigator.clipboard.writeText('npx nuxt-layers add @vantol/email')"
                            class="dark-btn"
                        >
                            Copy Install Command
                        </button>
                        <NuxtLink to="/docs" class="dark-btn-outline">
                            View Docs
                        </NuxtLink>
                    </div>
                </div>

                <!-- Right: Providers -->
                <div class="space-y-4">
                    <div class="dark-card p-6 flex items-center gap-6">
                        <div class="w-12 h-12 bg-[#0A0A0A] rounded flex items-center justify-center border border-white/10">
                            <span class="text-xl font-bold">R</span>
                        </div>
                        <div>
                            <h3 class="font-semibold mb-1">Resend</h3>
                            <p class="text-sm text-gray-500 font-light">Modern email API for developers</p>
                        </div>
                        <span class="ml-auto text-[10px] font-mono text-green-500 border border-green-500 px-2 py-0.5">SUPPORTED</span>
                    </div>
                    <div class="dark-card p-6 flex items-center gap-6">
                        <div class="w-12 h-12 bg-[#0A0A0A] rounded flex items-center justify-center border border-white/10">
                            <span class="text-xl font-bold">SG</span>
                        </div>
                        <div>
                            <h3 class="font-semibold mb-1">SendGrid</h3>
                            <p class="text-sm text-gray-500 font-light">Enterprise-grade email delivery</p>
                        </div>
                        <span class="ml-auto text-[10px] font-mono text-green-500 border border-green-500 px-2 py-0.5">SUPPORTED</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Templates Section -->
        <section class="min-h-screen flex flex-col justify-center px-6 border-t border-white/10">
            <div class="max-w-7xl mx-auto w-full py-20">
                <div class="dark-section-title mb-4">
                    <span>Templates</span>
                </div>
                <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-12">
                    Built-in email templates
                </h2>

                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="dark-card p-6 hover:border-orange-500/50 transition-colors">
                        <code class="text-orange-500 font-mono text-lg">welcome</code>
                        <p class="text-sm text-gray-500 mt-3 font-light">Onboard new users with a warm greeting</p>
                    </div>
                    <div class="dark-card p-6 hover:border-orange-500/50 transition-colors">
                        <code class="text-orange-500 font-mono text-lg">password-reset</code>
                        <p class="text-sm text-gray-500 mt-3 font-light">Secure password reset with expiring link</p>
                    </div>
                    <div class="dark-card p-6 hover:border-orange-500/50 transition-colors">
                        <code class="text-orange-500 font-mono text-lg">invoice</code>
                        <p class="text-sm text-gray-500 mt-3 font-light">Professional invoice with payment details</p>
                    </div>
                    <div class="dark-card p-6 hover:border-orange-500/50 transition-colors">
                        <code class="text-orange-500 font-mono text-lg">notification</code>
                        <p class="text-sm text-gray-500 mt-3 font-light">General notifications with action button</p>
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
                    Simple API
                </h2>

                <div class="grid lg:grid-cols-2 gap-8">
                    <!-- Configuration -->
                    <div class="terminal-window">
                        <div class="terminal-header">
                            <div class="terminal-dot bg-red-500"></div>
                            <div class="terminal-dot bg-yellow-500"></div>
                            <div class="terminal-dot bg-green-500"></div>
                            <span class="text-[10px] font-mono text-gray-500 ml-2">NUXT.CONFIG.TS</span>
                        </div>
                        <div class="terminal-body">
                            <pre class="text-gray-400"><code>runtimeConfig: {
  email: {
    provider: 'resend',
    resendApiKey: process.env.RESEND_API_KEY,
    fromEmail: 'hello@yourapp.com',
    fromName: 'Your App'
  }
}</code></pre>
                        </div>
                    </div>

                    <!-- Sending Emails -->
                    <div class="terminal-window">
                        <div class="terminal-header">
                            <div class="terminal-dot bg-red-500"></div>
                            <div class="terminal-dot bg-yellow-500"></div>
                            <div class="terminal-dot bg-green-500"></div>
                            <span class="text-[10px] font-mono text-gray-500 ml-2">COMPOSABLE</span>
                        </div>
                        <div class="terminal-body">
                            <pre class="text-gray-400"><code>const { sendWelcome } = useEmail()

// Send welcome email
await sendWelcome(
  'user@email.com', 
  { name: 'John' }
)</code></pre>
                        </div>
                    </div>
                </div>

                <div class="mt-12 text-center">
                    <button 
                        @click="navigator.clipboard.writeText('npx nuxt-layers add @vantol/email')"
                        class="dark-btn"
                    >
                        Install Layer →
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>
