<script setup lang="ts">
/**
 * SaaS App Shell - Main layout wrapper with sidebar navigation
 */

interface Props {
  sidebarCollapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  sidebarCollapsed: false
})

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
}>()

const collapsed = ref(props.sidebarCollapsed)
const mobileOpen = ref(false)

const toggleSidebar = () => {
  collapsed.value = !collapsed.value
  emit('toggle-sidebar')
}

// Close mobile sidebar on route change
const route = useRoute()
watch(() => route.path, () => {
  mobileOpen.value = false
})
</script>

<template>
  <div class="saas-shell">
    <!-- Mobile overlay -->
    <div 
      v-if="mobileOpen" 
      class="saas-shell-overlay"
      @click="mobileOpen = false"
    />

    <!-- Sidebar -->
    <aside 
      class="saas-shell-sidebar"
      :class="{ 
        'collapsed': collapsed,
        'mobile-open': mobileOpen 
      }"
    >
      <slot name="sidebar">
        <SaasSidebar :collapsed="collapsed" />
      </slot>
    </aside>

    <!-- Main content -->
    <div class="saas-shell-main" :class="{ 'sidebar-collapsed': collapsed }">
      <!-- Header -->
      <header class="saas-shell-header">
        <button 
          class="saas-shell-menu-btn md:hidden"
          @click="mobileOpen = !mobileOpen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        
        <button 
          class="saas-shell-collapse-btn hidden md:block"
          @click="toggleSidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ 'rotate-180': collapsed }">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <slot name="header">
          <SaasHeader />
        </slot>
      </header>

      <!-- Page content -->
      <main class="saas-shell-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.saas-shell {
  display: flex;
  min-height: 100vh;
  background: #0A0A0A;
}

.saas-shell-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;
  backdrop-filter: blur(4px);
}

.saas-shell-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 260px;
  background: #111111;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  z-index: 50;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.saas-shell-sidebar.collapsed {
  width: 68px;
}

@media (max-width: 768px) {
  .saas-shell-sidebar {
    transform: translateX(-100%);
  }
  .saas-shell-sidebar.mobile-open {
    transform: translateX(0);
  }
}

.saas-shell-main {
  flex: 1;
  margin-left: 260px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}

.saas-shell-main.sidebar-collapsed {
  margin-left: 68px;
}

@media (max-width: 768px) {
  .saas-shell-main {
    margin-left: 0;
  }
}

.saas-shell-header {
  height: 60px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  gap: 1rem;
  background: #0A0A0A;
  position: sticky;
  top: 0;
  z-index: 30;
}

.saas-shell-menu-btn,
.saas-shell-collapse-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #888;
  transition: all 0.2s;
  background: transparent;
  border: none;
  cursor: pointer;
}

.saas-shell-menu-btn:hover,
.saas-shell-collapse-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.saas-shell-collapse-btn svg {
  transition: transform 0.3s ease;
}

.saas-shell-content {
  flex: 1;
  padding: 2rem;
}

@media (max-width: 768px) {
  .saas-shell-content {
    padding: 1rem;
  }
}
</style>
