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

    <!-- Featured Layers Section - Full Screen -->
    <section class="min-h-screen flex flex-col justify-center px-6 border-t border-white/10">
      <div class="max-w-7xl mx-auto w-full py-20">
        <div class="dark-section-title mb-4">
          <span>Featured</span>
        </div>
        
        <div class="flex items-end justify-between mb-12">
          <h2 class="text-3xl md:text-4xl font-bold tracking-tight">
            NuxtLayers news & updates
          </h2>
          <NuxtLink to="/layers" class="dark-btn-outline text-xs hidden md:inline-flex">
            See All →
          </NuxtLink>
        </div>

        <!-- Layer Cards Grid -->
        <div ref="cardsRef" class="grid md:grid-cols-2 gap-6">
          <NuxtLink
            v-for="(layer, index) in featuredLayers"
            :key="layer.id"
            :to="`/layers/${encodeURIComponent(layer.id)}`"
            class="dark-card p-6 hover:border-orange-500/50 transition-all duration-300 group hover:scale-[1.02]"
            :style="{ transitionDelay: `${index * 50}ms` }"
          >
            <div class="flex items-center gap-2 mb-4">
              <span class="text-[10px] font-mono text-orange-500 border border-orange-500 px-2 py-0.5">{{ layer.tag }}</span>
              <span v-if="layer.isNew" class="text-[10px] font-mono bg-orange-500 text-black px-2 py-0.5">NEW</span>
            </div>
            <h3 class="text-lg font-bold mb-3 group-hover:text-orange-500 transition-colors">{{ layer.id }}</h3>
            <p class="text-sm text-gray-500 font-light mb-6 leading-relaxed">{{ layer.description }}</p>
            <div class="text-xs font-mono text-orange-500 uppercase group-hover:translate-x-1 transition-transform">
              Learn More →
            </div>
          </NuxtLink>
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
