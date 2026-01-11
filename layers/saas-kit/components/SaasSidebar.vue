<script setup lang="ts">
/**
 * SaaS Sidebar Navigation
 */

interface Props {
  collapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false
})

const route = useRoute()
const config = useRuntimeConfig()

const appName = computed(() => config.public.saasKit?.appName || 'App')

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/app', 
    icon: 'home',
    exact: true
  },
  { 
    name: 'Projects', 
    href: '/app/projects', 
    icon: 'folder'
  },
  { 
    name: 'Team', 
    href: '/app/settings/members', 
    icon: 'users'
  },
  { 
    name: 'Billing', 
    href: '/app/settings/billing', 
    icon: 'credit-card'
  },
  { 
    name: 'Settings', 
    href: '/app/settings', 
    icon: 'settings'
  }
]

const isActive = (item: typeof navigation[0]) => {
  if (item.exact) {
    return route.path === item.href
  }
  return route.path.startsWith(item.href)
}

// Icon components mapping
const icons = {
  home: `<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
  folder: `<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>`,
  users: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  'credit-card': `<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>`,
  settings: `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>`
}
</script>

<template>
  <div class="saas-sidebar">
    <!-- Logo / Brand -->
    <div class="saas-sidebar-brand">
      <NuxtLink to="/app" class="saas-sidebar-logo">
        <div class="saas-sidebar-logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/>
            <polyline points="2 17 12 22 22 17"/>
            <polyline points="2 12 12 17 22 12"/>
          </svg>
        </div>
        <span v-if="!collapsed" class="saas-sidebar-logo-text">{{ appName }}</span>
      </NuxtLink>
    </div>

    <!-- Team Switcher -->
    <div v-if="!collapsed" class="saas-sidebar-team">
      <SaasTeamSwitcher />
    </div>

    <!-- Navigation -->
    <nav class="saas-sidebar-nav">
      <NuxtLink
        v-for="item in navigation"
        :key="item.name"
        :to="item.href"
        class="saas-sidebar-link"
        :class="{ active: isActive(item) }"
        :title="collapsed ? item.name : undefined"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
          v-html="icons[item.icon as keyof typeof icons]"
        />
        <span v-if="!collapsed">{{ item.name }}</span>
      </NuxtLink>
    </nav>

    <!-- Bottom section -->
    <div class="saas-sidebar-footer">
      <div v-if="!collapsed" class="saas-sidebar-upgrade">
        <div class="text-[10px] font-mono text-orange-500 uppercase mb-1">Pro Plan</div>
        <div class="text-xs text-gray-500">14 days left in trial</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.saas-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #fff;
}

.saas-sidebar-brand {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.saas-sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: #fff;
}

.saas-sidebar-logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #F97316, #ea580c);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.saas-sidebar-logo-icon svg {
  color: #000;
}

.saas-sidebar-logo-text {
  font-weight: 700;
  font-size: 0.9rem;
}

.saas-sidebar-team {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.saas-sidebar-nav {
  flex: 1;
  padding: 0.75rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.saas-sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  color: #888;
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.saas-sidebar-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.saas-sidebar-link.active {
  background: rgba(249, 115, 22, 0.1);
  color: #F97316;
}

.saas-sidebar-link.active svg {
  color: #F97316;
}

.saas-sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin-top: auto;
}

.saas-sidebar-upgrade {
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
}
</style>
