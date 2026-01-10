<script setup lang="ts">
/**
 * Shared navigation bar component.
 * Shows auth-aware links (Dashboard when logged in, Login when not).
 */
 import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user, isAdmin } = storeToRefs(authStore)
const route = useRoute()

// Check if current page is active
const isActive = (path: string) => route.path === path

// Avatar error state
const imageError = ref(false)
// Reset error when user changes
watch(() => user.value?.photoURL, () => {
  imageError.value = false
})
</script>

<template>
  <nav class="sticky top-0 z-50 border-b border-white/10 bg-[#0A0A0A]/90 backdrop-blur-sm">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2">
        <span class="w-2 h-2 bg-orange-500 rounded-full"></span>
        <span class="text-xs font-bold uppercase tracking-widest text-white">NuxtLayers</span>
      </NuxtLink>

      <!-- Navigation Links -->
      <div class="hidden md:flex items-center gap-6">
        <NuxtLink 
          to="/layers" 
          class="text-xs font-mono uppercase transition-colors"
          :class="isActive('/layers') ? 'text-white' : 'text-gray-500 hover:text-white'"
        >
          Browse
        </NuxtLink>
        <NuxtLink 
          to="/docs" 
          class="text-xs font-mono uppercase transition-colors"
          :class="isActive('/docs') ? 'text-white' : 'text-gray-500 hover:text-white'"
        >
          Docs
        </NuxtLink>
        <NuxtLink 
          to="/blog" 
          class="text-xs font-mono uppercase transition-colors"
          :class="isActive('/blog') ? 'text-white' : 'text-gray-500 hover:text-white'"
        >
          Blog
        </NuxtLink>
        <NuxtLink 
          to="/publish" 
          class="text-xs font-mono uppercase transition-colors"
          :class="isActive('/publish') ? 'text-white' : 'text-gray-500 hover:text-white'"
        >
          Publish
        </NuxtLink>
        <NuxtLink 
          to="/pricing" 
          class="text-xs font-mono uppercase transition-colors"
          :class="isActive('/pricing') ? 'text-white' : 'text-gray-500 hover:text-white'"
        >
          Pricing
        </NuxtLink>

        <!-- Auth-aware links -->
        <template v-if="user">
          <NuxtLink 
            to="/dashboard" 
            class="text-xs font-mono uppercase transition-colors"
            :class="isActive('/dashboard') ? 'text-white' : 'text-gray-500 hover:text-white'"
          >
            Dashboard
          </NuxtLink>
        </template>
      </div>

      <!-- Right side: Auth buttons or user info -->
      <div class="flex items-center gap-3">
        <template v-if="user">
          <!-- User info -->
          <NuxtLink to="/account" class="flex items-center gap-2 group">
            <div class="relative w-6 h-6 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-orange-500 transition-all bg-white/10 flex items-center justify-center">
                <img 
                  v-if="user.photoURL && !imageError" 
                  :src="user.photoURL" 
                  :alt="user.displayName || 'User'" 
                  class="w-full h-full object-cover"
                  @error="imageError = true"
                />
                <span v-else class="text-[10px] font-bold text-gray-300">
                    {{ (user.displayName || user.email || 'U').charAt(0).toUpperCase() }}
                </span>
            </div>
            <span v-if="isAdmin" class="text-[10px] font-mono text-orange-500 uppercase hidden sm:inline">Admin</span>
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="dark-btn-outline text-xs">Log In</NuxtLink>
          <NuxtLink to="/onboarding" class="dark-btn text-xs hidden sm:inline-flex">Get Started →</NuxtLink>
        </template>
      </div>
    </div>
  </nav>
</template>
