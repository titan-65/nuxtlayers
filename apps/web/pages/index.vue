<script setup lang="ts">
import { gsap } from 'gsap'

useHead({
  title: 'NuxtLayers - Discover & Install Nuxt Layers'
})

const copied = ref(false)
const installCommand = 'npx nuxt-layers add @vantol/auth-firebase'

// Animation refs
const heroRef = ref<HTMLElement | null>(null)
const terminalRef = ref<HTMLElement | null>(null)
const ideRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)

const copyCommand = async () => {
  await navigator.clipboard.writeText(installCommand)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

// Fetch featured layers from API
const featuredLayers = ref<any[]>([])
const stats = ref({ totalLayers: 0, totalDownloads: '0', publishers: 0 })

const { data: landingData } = await useFetch('/api/landing/featured')

if (landingData.value?.success) {
  featuredLayers.value = landingData.value.data.featuredLayers
  stats.value = landingData.value.data.stats
}

// GSAP entrance animations
onMounted(() => {
  // Hero section animation
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  
  tl.from('.hero-title', {
    opacity: 0,
    y: 60,
    duration: 1,
    delay: 0.2
  })
  .from('.hero-description', {
    opacity: 0,
    y: 30,
    duration: 0.8
  }, '-=0.6')
  .from('.hero-terminal', {
    opacity: 0,
    y: 40,
    scale: 0.95,
    duration: 0.8
  }, '-=0.5')
  .from('.hero-cta', {
    opacity: 0,
    y: 20,
    duration: 0.6
  }, '-=0.4')
  .from('.hero-ide', {
    opacity: 0,
    x: 60,
    duration: 1
  }, '-=0.8')

  // Terminal typing effect
  gsap.from('.terminal-line', {
    opacity: 0,
    x: -20,
    duration: 0.4,
    stagger: 0.15,
    delay: 1.5
  })

  // Scroll-triggered animations for all sections
  const sections = document.querySelectorAll('.animate-section')
  sections.forEach((section) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.from(entry.target.querySelectorAll('.animate-item'), {
              opacity: 0,
              y: 40,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power3.out'
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )
    observer.observe(section)
  })

  // Featured cards stagger animation
  const cardsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.from('.feature-card', {
            opacity: 0,
            y: 60,
            scale: 0.95,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
          })
          cardsObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 }
  )
  
  const cardsContainer = document.querySelector('.cards-container')
  if (cardsContainer) cardsObserver.observe(cardsContainer)
})
</script>

<template>
  <div class="min-h-screen bg-[#0A0A0A] text-white selection:bg-orange-500 selection:text-black overflow-x-hidden">
    <!-- Navigation provided by default layout -->

    <!-- Hero Section - Full Screen with RippleGrid -->
    <section class="min-h-screen flex items-center px-6 pt-20 relative overflow-hidden">
      <!-- Background Effect -->
      <ClientOnly>
        <div class="absolute inset-0 z-0">
          <HeroRippleGrid
            :grid-color="'#F97316'"
            :ripple-intensity="0.03"
            :grid-size="8"
            :grid-thickness="20"
            :opacity="0.4"
            :vignette-strength="2.5"
          />
        </div>
      </ClientOnly>
      
      <div class="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div ref="heroRef">
          <div class="dark-section-title mb-6 hero-title">
            <span>Registry</span>
          </div>
          
          <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight hero-title">
            Layers meet you<br>
            <span class="text-gray-500">wherever you work.</span>
          </h1>
          
          <p class="text-gray-500 mb-10 max-w-md font-light leading-relaxed hero-description">
            Layers embed directly into your Nuxt app. Auth, Blog, Admin, Payments. Install features as they come to mind, wherever you are.
          </p>

          <!-- Terminal Window -->
          <div ref="terminalRef" class="terminal-window mb-8 max-w-md hero-terminal">
            <div class="terminal-header">
              <div class="terminal-dot bg-red-500"></div>
              <div class="terminal-dot bg-yellow-500"></div>
              <div class="terminal-dot bg-green-500"></div>
              <span class="text-[10px] font-mono text-gray-500 ml-2">TERMINAL / ZSH</span>
            </div>
            <div class="terminal-body">
              <div class="text-gray-500 mb-2 terminal-line">~/my-nuxt-app <span class="text-orange-500">(main)</span></div>
              <div class="flex items-center gap-2 terminal-line">
                <span class="text-orange-500">$</span>
                <code class="text-white">{{ installCommand }}</code>
                <button @click="copyCommand" class="ml-auto text-[10px] font-mono text-gray-500 hover:text-orange-500 uppercase transition-colors">
                  {{ copied ? '✓' : 'Copy' }}
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-4 hero-cta">
            <NuxtLink to="/layers" class="dark-btn">
              Explore Layers →
            </NuxtLink>
          </div>
        </div>

        <!-- IDE Preview -->
        <div ref="ideRef" class="hidden lg:block hero-ide">
          <div class="terminal-window">
            <div class="terminal-header">
              <div class="terminal-dot bg-red-500"></div>
              <div class="terminal-dot bg-yellow-500"></div>
              <div class="terminal-dot bg-green-500"></div>
              <span class="text-[10px] font-mono text-gray-500 ml-auto">TERMINAL / IDE</span>
            </div>
            <div class="bg-[#0D0D0D] p-6 font-mono text-xs min-h-[300px]">
              <div class="text-gray-500 mb-3">▸ EXPLORER</div>
              <div class="space-y-1.5 text-gray-400 ml-2">
                <div class="terminal-line">▸ <span class="text-orange-500">CREATE NUXT APP</span></div>
                <div class="ml-4 terminal-line">▸ .nuxt</div>
                <div class="ml-4 terminal-line">▸ components</div>
                <div class="ml-4 terminal-line">▸ <span class="text-white">layers</span></div>
                <div class="ml-6 text-gray-500 terminal-line">📁 auth-firebase</div>
                <div class="ml-6 text-gray-500 terminal-line">📁 blog</div>
                <div class="ml-6 text-gray-500 terminal-line">📁 admin</div>
                <div class="ml-4 terminal-line">▸ pages</div>
                <div class="ml-4 terminal-line">📄 nuxt.config.ts</div>
                <div class="ml-4 terminal-line">📄 package.json</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Built-In Features Section -->
    <section class="min-h-screen flex flex-col justify-center px-6 border-t border-white/10">
      <div class="max-w-7xl mx-auto w-full py-20">
        <div class="dark-section-title mb-4">
          <span>Powered by Layers</span>
        </div>
        
        <div class="flex items-end justify-between mb-12">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              This site uses NuxtLayers
            </h2>
            <p class="text-gray-500 font-light max-w-xl">
              Every feature on this platform is built with our own layers. Authentication, blog, and more — all installed with a single command.
            </p>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <!-- Auth Feature -->
          <NuxtLink to="/login" class="dark-card p-6 hover:border-orange-500/50 transition-all group">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-[10px] font-mono text-orange-500 border border-orange-500 px-2 py-0.5">ACTIVE</span>
            </div>
            <h3 class="text-lg font-bold mb-2 group-hover:text-orange-500 transition-colors">Authentication</h3>
            <p class="text-sm text-gray-500 font-light mb-4">Google SSO powered by <code class="text-orange-500">@vantol/auth-firebase</code></p>
            <div class="terminal-window">
              <div class="terminal-body !p-3 text-xs">
                <span class="text-orange-500">$</span> npx nuxt-layers add @vantol/auth-firebase
              </div>
            </div>
          </NuxtLink>

          <!-- Blog Feature -->
          <NuxtLink to="/blog" class="dark-card p-6 hover:border-orange-500/50 transition-all group">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-[10px] font-mono text-orange-500 border border-orange-500 px-2 py-0.5">ACTIVE</span>
            </div>
            <h3 class="text-lg font-bold mb-2 group-hover:text-orange-500 transition-colors">Blog & Changelog</h3>
            <p class="text-sm text-gray-500 font-light mb-4">Real-time blog with <code class="text-orange-500">@vantol/blog</code></p>
            <div class="terminal-window">
              <div class="terminal-body !p-3 text-xs">
                <span class="text-orange-500">$</span> npx nuxt-layers add @vantol/blog
              </div>
            </div>
          </NuxtLink>

          <!-- Dashboard Feature -->
          <NuxtLink to="/dashboard" class="dark-card p-6 hover:border-orange-500/50 transition-all group">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-[10px] font-mono text-gray-500 border border-gray-500 px-2 py-0.5">COMING</span>
            </div>
            <h3 class="text-lg font-bold mb-2 group-hover:text-orange-500 transition-colors">Admin Dashboard</h3>
            <p class="text-sm text-gray-500 font-light mb-4">Publisher dashboard with <code class="text-orange-500">@vantol/admin</code></p>
            <div class="terminal-window">
              <div class="terminal-body !p-3 text-xs">
                <span class="text-orange-500">$</span> npx nuxt-layers add @vantol/admin
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Premium Layers Showcase -->
    <section class="py-24 px-6 border-t border-white/10 bg-gradient-to-b from-purple-900/10 to-transparent">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-[10px] font-mono text-purple-400 border border-purple-500 px-2 py-0.5 uppercase">Premium</span>
          <span class="dark-section-title !mb-0">Layers</span>
        </div>
        
        <div class="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-12">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Ship faster with<br>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">premium starters</span>
            </h2>
            <p class="text-gray-500 max-w-xl">
              Production-ready layers with advanced features. Teams, billing, analytics, and more.
            </p>
          </div>
          <NuxtLink to="/pricing" class="dark-btn-outline text-xs border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
            View Pricing →
          </NuxtLink>
        </div>

        <!-- Premium Cards -->
        <div class="grid md:grid-cols-3 gap-6">
          <!-- SaaS Kit -->
          <NuxtLink to="/layers/saas-kit" class="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div class="p-6 relative">
              <div class="flex items-center gap-2 mb-4">
                <span class="text-2xl">🚀</span>
                <span class="text-[10px] font-mono text-purple-400 border border-purple-500/50 px-2 py-0.5">POPULAR</span>
              </div>
              <h3 class="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">SaaS Kit</h3>
              <p class="text-sm text-gray-500 mb-4">Teams, billing, onboarding, dashboard. Everything to launch a SaaS.</p>
              <div class="flex items-center justify-between">
                <code class="text-xs text-orange-500">@vantol/saas-kit</code>
                <span class="text-sm text-gray-400">$49/mo</span>
              </div>
            </div>
          </NuxtLink>

          <!-- Payments -->
          <NuxtLink to="/layers/payments" class="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div class="p-6 relative">
              <div class="flex items-center gap-2 mb-4">
                <span class="text-2xl">💳</span>
              </div>
              <h3 class="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">Payments</h3>
              <p class="text-sm text-gray-500 mb-4">Stripe & Polar integration with checkout, subscriptions, and portals.</p>
              <div class="flex items-center justify-between">
                <code class="text-xs text-orange-500">@vantol/payments</code>
                <span class="text-sm text-gray-400">$39/mo</span>
              </div>
            </div>
          </NuxtLink>

          <!-- Analytics -->
          <NuxtLink to="/layers/analytics" class="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div class="p-6 relative">
              <div class="flex items-center gap-2 mb-4">
                <span class="text-2xl">📊</span>
              </div>
              <h3 class="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">Analytics</h3>
              <p class="text-sm text-gray-500 mb-4">Privacy-focused analytics dashboard with real-time tracking.</p>
              <div class="flex items-center justify-between">
                <code class="text-xs text-orange-500">@vantol/analytics</code>
                <span class="text-sm text-gray-400">$29/mo</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Try Demo CTA -->
        <div class="mt-12 text-center">
          <NuxtLink 
            to="/app" 
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/25"
          >
            ✨ Try SaaS Kit Demo
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- News & Updates Section - Full Screen -->
    <section class="min-h-screen flex flex-col justify-center px-6 border-t border-white/10">
      <div class="max-w-7xl mx-auto w-full py-20">
        <div class="dark-section-title mb-4">
          <span>News</span>
        </div>
        
        <div class="flex items-end justify-between mb-12">
          <h2 class="text-3xl md:text-4xl font-bold tracking-tight">
            Latest updates & releases
          </h2>
          <NuxtLink to="/blog" class="dark-btn-outline text-xs hidden md:inline-flex">
            View Blog →
          </NuxtLink>
        </div>

        <!-- Announcements Grid -->
        <div class="grid lg:grid-cols-3 gap-6 mb-12">
          <!-- Major Announcement -->
          <div class="lg:col-span-2 dark-card p-8 bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/30">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-[10px] font-mono bg-orange-500 text-black px-2 py-0.5">ANNOUNCEMENT</span>
              <span class="text-[10px] font-mono text-gray-500">JAN 2026</span>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-orange-500">🚀 Introducing Premium Layers</h3>
            <p class="text-gray-400 mb-6 leading-relaxed">
              We're excited to launch our premium layer collection! SaaS Kit, Payments, and Analytics 
              layers are now available for teams who want to ship faster. Each layer comes with 
              production-ready code, documentation, and ongoing updates.
            </p>
            <NuxtLink to="/layers/saas-kit" class="text-orange-500 font-mono text-sm hover:underline">
              Explore SaaS Kit →
            </NuxtLink>
          </div>

          <!-- Side Updates -->
          <div class="space-y-4">
            <!-- Update 1: Waitlist -->
            <NuxtLink to="/layers/waitlist" class="block dark-card p-5 hover:border-orange-500/30 transition-all group">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-[10px] font-mono text-orange-500 border border-orange-500 px-2 py-0.5">NEW LAYER</span>
              </div>
              <h4 class="font-bold mb-1 group-hover:text-orange-500 transition-colors">@vantol/waitlist</h4>
              <p class="text-sm text-gray-500">Pre-launch waitlist with viral referral tracking.</p>
            </NuxtLink>

            <!-- Update 2: Email -->
            <NuxtLink to="/layers/email" class="block dark-card p-5 hover:border-blue-500/30 transition-all group">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-[10px] font-mono text-blue-500 border border-blue-500 px-2 py-0.5">NEW LAYER</span>
              </div>
              <h4 class="font-bold mb-1 group-hover:text-blue-500 transition-colors">@vantol/email</h4>
              <p class="text-sm text-gray-500">Transactional emails with Resend/Sendgrid.</p>
            </NuxtLink>

            <!-- Update 3: CLI -->
            <div class="dark-card p-5 hover:border-green-500/30 transition-all">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-[10px] font-mono text-green-500 border border-green-500 px-2 py-0.5">RELEASE</span>
              </div>
              <h4 class="font-bold mb-1">CLI v2.0 Released</h4>
              <p class="text-sm text-gray-500">License keys, faster installs.</p>
            </div>

            <!-- Update 4: Analytics -->
            <NuxtLink to="/layers/analytics" class="block dark-card p-5 hover:border-purple-500/30 transition-all group">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-[10px] font-mono text-purple-500 border border-purple-500 px-2 py-0.5">PREMIUM</span>
              </div>
              <h4 class="font-bold mb-1 group-hover:text-purple-500 transition-colors">@vantol/analytics</h4>
              <p class="text-sm text-gray-500">Privacy-focused analytics dashboard.</p>
            </NuxtLink>
          </div>
        </div>

        <!-- Featured Layers -->
        <div class="border-t border-white/10 pt-12">
          <h3 class="text-xl font-bold mb-6 text-gray-400">Featured Layers</h3>
          <div ref="cardsRef" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 cards-container">
            <NuxtLink
              v-for="(layer, index) in featuredLayers.slice(0, 6)"
              :key="layer.id"
              :to="`/layers/${encodeURIComponent(layer.id)}`"
              class="dark-card p-6 hover:border-orange-500/50 transition-all duration-300 group hover:scale-[1.02] feature-card"
              :style="{ transitionDelay: `${index * 50}ms` }"
            >
              <div class="flex items-center gap-2 mb-4">
                <span class="text-[10px] font-mono text-orange-500 border border-orange-500 px-2 py-0.5">{{ layer.tag }}</span>
                <span v-if="layer.isNew" class="text-[10px] font-mono bg-orange-500 text-black px-2 py-0.5">NEW</span>
              </div>
              <h3 class="text-lg font-bold mb-3 group-hover:text-orange-500 transition-colors">{{ layer.id }}</h3>
              <p class="text-sm text-gray-500 font-light mb-4 leading-relaxed line-clamp-2">{{ layer.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-600">{{ layer.downloads }} downloads</span>
                <span class="text-xs font-mono text-orange-500 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Join Section - Full Screen -->
    <section class="min-h-screen flex flex-col justify-center px-6 border-t border-white/10">
      <div class="max-w-7xl mx-auto w-full py-20">
        <div class="dark-section-title mb-4">
          <span>Publish</span>
        </div>
        
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Join us
            </h2>
            <p class="text-gray-500 font-light leading-relaxed mb-8 max-w-md">
              Share your Nuxt layers with the community. Publish once, let developers install with a single command.
            </p>
            <NuxtLink to="/onboarding" class="dark-btn">
              Become a Publisher →
            </NuxtLink>
          </div>
          
          <div class="terminal-window">
            <div class="terminal-header">
              <div class="terminal-dot bg-red-500"></div>
              <div class="terminal-dot bg-yellow-500"></div>
              <div class="terminal-dot bg-green-500"></div>
              <span class="text-[10px] font-mono text-gray-500 ml-2">PUBLISH</span>
            </div>
            <div class="terminal-body space-y-2">
              <div><span class="text-orange-500">$</span> nuxt-layers login</div>
              <div class="text-gray-500">✓ Authenticated as you@example.com</div>
              <div><span class="text-orange-500">$</span> nuxt-layers publish</div>
              <div class="text-gray-500">✓ Validating layer.json...</div>
              <div class="text-gray-500">✓ Creating tarball...</div>
              <div class="text-gray-500">✓ Uploading to registry...</div>
              <div class="text-green-500">✓ Published @your-org/layer@1.0.0</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-8 px-6 border-t border-white/10">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 bg-orange-500 rounded-full"></span>
          <span class="text-[10px] font-mono text-gray-600 uppercase">© 2026 NuxtLayers</span>
        </div>
        <div class="flex items-center gap-6">
          <a href="https://github.com/nuxtlayers" class="text-[10px] font-mono text-gray-600 hover:text-white transition-colors uppercase">GitHub</a>
          <a href="https://twitter.com/nuxtlayers" class="text-[10px] font-mono text-gray-600 hover:text-white transition-colors uppercase">Twitter</a>
          <NuxtLink to="/docs" class="text-[10px] font-mono text-gray-600 hover:text-white transition-colors uppercase">Docs</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Smooth transitions for interactive elements */
.dark-card {
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.dark-btn, .dark-btn-outline {
  transition: all 0.2s ease;
}

.dark-btn:hover {
  transform: translateY(-1px);
}
</style>
