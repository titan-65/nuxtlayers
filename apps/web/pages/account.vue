<script setup lang="ts">
import { storeToRefs } from 'pinia'

/**
 * Account settings page with real auth and signout.
 */
useHead({
  title: 'Account Settings - NuxtLayers'
})

definePageMeta({
  middleware: (to, from) => {
    // Basic client-side route protection
    // State might be loading, so we ideally wait or redirect inside component
  }
})

const authStore = useAuthStore()
const { user, loading } = storeToRefs(authStore)
const { logout } = authStore
const router = useRouter()

const handleSignOut = async () => {
  await logout()
  router.push('/')
}

// Mock API key for now
const showApiKey = ref(false)
</script>

<template>
  <div class="min-h-screen bg-[#0A0A0A] text-white selection:bg-orange-500 selection:text-black">
    <!-- Navigation provided by default layout -->

    <div class="max-w-3xl mx-auto px-6 py-12">
      <div class="dark-section-title mb-4">
        <span>Settings</span>
      </div>
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold mb-2 tracking-tight">Account</h1>
          <p class="text-gray-500 font-light text-sm">Manage your profile and session.</p>
        </div>
        <button @click="handleSignOut" class="dark-btn-outline text-xs">
          Sign Out
        </button>
      </div>

      <div v-if="user" class="space-y-8">
        <!-- Profile -->
        <section>
          <h2 class="text-sm font-bold uppercase tracking-wide mb-4 text-orange-500">Profile</h2>
          <div class="dark-card p-6 space-y-4">
            <div class="flex items-center gap-4 mb-6">
              <img 
                v-if="user.photoURL" 
                :src="user.photoURL" 
                :alt="user.displayName || 'User'" 
                class="w-16 h-16 rounded-full ring-2 ring-white/10"
              />
              <div v-else class="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold text-gray-400">
                {{ (user.displayName || user.email || 'U').charAt(0).toUpperCase() }}
              </div>
              <div>
                <h3 class="font-bold text-lg">{{ user.displayName || 'Anonymous User' }}</h3>
                <p class="text-sm text-gray-500 font-mono">{{ user.email }}</p>
              </div>
            </div>

            <div>
              <label class="text-[10px] font-mono text-gray-400 uppercase block mb-2">Display Name</label>
              <input 
                :value="user.displayName" 
                disabled
                class="dark-input w-full opacity-50 cursor-not-allowed" 
              />
              <p class="text-[10px] text-gray-600 mt-2">To change details, manage your Google Account.</p>
            </div>
          </div>
        </section>

        <!-- API Key -->
        <section>
          <h2 class="text-sm font-bold uppercase tracking-wide mb-4 text-orange-500">API Access</h2>
          <div class="dark-card p-6">
            <p class="text-xs text-gray-500 font-light mb-4">Use this key to authenticate the CLI.</p>
            <div class="flex items-center gap-4">
              <code class="dark-input flex-1 font-mono text-xs flex items-center">
                {{ showApiKey ? 'nlk_abc123def456ghi789jkl' : 'nlk_•••••••••••••••••••••' }}
              </code>
              <button @click="showApiKey = !showApiKey" class="dark-btn-outline text-[10px]">
                {{ showApiKey ? 'Hide' : 'Show' }}
              </button>
            </div>
            <p class="text-[10px] text-gray-600 mt-3 font-mono">
              $ npx nuxt-layers login
            </p>
          </div>
        </section>

        <!-- Danger Zone -->
        <section>
          <h2 class="text-sm font-bold uppercase tracking-wide mb-4 text-red-500">Danger Zone</h2>
          <div class="dark-card p-6 border-red-900/30 bg-red-900/5">
             <div class="flex items-center justify-between">
               <div>
                  <h3 class="text-sm font-bold text-red-400 mb-1">Sign Out</h3>
                  <p class="text-xs text-gray-500 font-light">End your current session on this device.</p>
               </div>
               <button @click="handleSignOut" class="text-[10px] font-mono uppercase tracking-wide text-red-400 border border-red-900/50 px-4 py-2 hover:bg-red-900/20 transition-colors">
                  Sign Out
               </button>
             </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
