<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

useHead({
    title: '@vantol/database - NuxtLayers'
})

const providers = [
    { name: 'Firebase', icon: '🔥', desc: 'Firestore NoSQL database' },
    { name: 'Supabase', icon: '⚡', desc: 'PostgreSQL with realtime' },
    { name: 'Neon', icon: '🌙', desc: 'Serverless PostgreSQL' },
    { name: 'PostgreSQL', icon: '🐘', desc: 'Generic PostgreSQL' },
    { name: 'MongoDB', icon: '🍃', desc: 'Document database' },
    { name: 'Convex', icon: '🔷', desc: 'Reactive backend' }
]
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
                        @vantol/<span class="text-orange-500">database</span>
                    </h1>

                    <p class="text-gray-500 mb-10 max-w-md font-light leading-relaxed">
                        Database-agnostic layer with unified API. Switch between Firebase, Supabase, Neon, Convex, PostgreSQL, and MongoDB with zero code changes.
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
                                <code class="text-white">npx nuxt-layers add @vantol/database</code>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <button 
                            @click="navigator.clipboard.writeText('npx nuxt-layers add @vantol/database')"
                            class="dark-btn"
                        >
                            Copy Install Command
                        </button>
                        <NuxtLink to="/docs" class="dark-btn-outline">
                            View Docs
                        </NuxtLink>
                    </div>
                </div>

                <!-- Right: Providers Grid -->
                <div class="grid grid-cols-2 gap-4">
                    <div 
                        v-for="provider in providers" 
                        :key="provider.name"
                        class="dark-card p-5 hover:border-orange-500/50 transition-colors"
                    >
                        <div class="text-2xl mb-3">{{ provider.icon }}</div>
                        <h3 class="font-semibold mb-1">{{ provider.name }}</h3>
                        <p class="text-sm text-gray-500 font-light">{{ provider.desc }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Unified API Section -->
        <section class="min-h-screen flex flex-col justify-center px-6 border-t border-white/10">
            <div class="max-w-7xl mx-auto w-full py-20">
                <div class="dark-section-title mb-4">
                    <span>API</span>
                </div>
                <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-12">
                    One API, any database
                </h2>

                <div class="grid lg:grid-cols-2 gap-8">
                    <!-- Server Usage -->
                    <div class="terminal-window">
                        <div class="terminal-header">
                            <div class="terminal-dot bg-red-500"></div>
                            <div class="terminal-dot bg-yellow-500"></div>
                            <div class="terminal-dot bg-green-500"></div>
                            <span class="text-[10px] font-mono text-gray-500 ml-2">SERVER / API ROUTE</span>
                        </div>
                        <div class="terminal-body">
                            <pre class="text-gray-400"><code>import { getDatabase } from '#database'

const db = getDatabase()

// Works with ANY provider!
const users = await db.findMany('users', {
  where: { role: 'admin' },
  orderBy: { field: 'createdAt', direction: 'desc' },
  limit: 10
})</code></pre>
                        </div>
                    </div>

                    <!-- Client Usage -->
                    <div class="terminal-window">
                        <div class="terminal-header">
                            <div class="terminal-dot bg-red-500"></div>
                            <div class="terminal-dot bg-yellow-500"></div>
                            <div class="terminal-dot bg-green-500"></div>
                            <span class="text-[10px] font-mono text-gray-500 ml-2">CLIENT / COMPOSABLE</span>
                        </div>
                        <div class="terminal-body">
                            <pre class="text-gray-400"><code>const db = useDatabase()

// Create
await db.create('posts', { title: 'Hello' })

// Read
const post = await db.findById('posts', id)

// Update
await db.update('posts', id, { title: 'Updated' })

// Delete
await db.delete('posts', id)</code></pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Configuration Section -->
        <section class="min-h-screen flex flex-col justify-center px-6 border-t border-white/10">
            <div class="max-w-7xl mx-auto w-full py-20">
                <div class="dark-section-title mb-4">
                    <span>Config</span>
                </div>
                <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-12">
                    Switch providers with config
                </h2>

                <div class="terminal-window max-w-3xl">
                    <div class="terminal-header">
                        <div class="terminal-dot bg-red-500"></div>
                        <div class="terminal-dot bg-yellow-500"></div>
                        <div class="terminal-dot bg-green-500"></div>
                        <span class="text-[10px] font-mono text-gray-500 ml-2">NUXT.CONFIG.TS</span>
                    </div>
                    <div class="terminal-body">
                        <pre class="text-gray-400"><code>runtimeConfig: {
  database: {
    // Change provider - code stays the same!
    provider: 'supabase', // or 'firebase', 'neon', 'mongodb', 'convex'
    
    // Provider-specific config
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    
    // Or for PostgreSQL/Neon
    // postgresUrl: process.env.DATABASE_URL,
    
    // Or for MongoDB
    // mongodbUri: process.env.MONGODB_URI,
  }
}</code></pre>
                    </div>
                </div>

                <div class="mt-12 text-center">
                    <button 
                        @click="navigator.clipboard.writeText('npx nuxt-layers add @vantol/database')"
                        class="dark-btn"
                    >
                        Install Layer →
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>
