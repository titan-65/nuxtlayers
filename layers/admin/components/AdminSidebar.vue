<script setup lang="ts">
/**
 * Admin sidebar navigation component.
 */
interface NavItem {
  label: string
  icon: string
  to: string
  badge?: number
}

const props = defineProps<{
  items?: NavItem[]
}>()

const defaultItems: NavItem[] = [
  { label: 'Dashboard', icon: 'home', to: '/admin' },
  { label: 'Users', icon: 'users', to: '/admin/users' },
  { label: 'Content', icon: 'file', to: '/admin/content' },
  { label: 'Analytics', icon: 'chart', to: '/admin/analytics' },
  { label: 'Settings', icon: 'settings', to: '/admin/settings' }
]

const navItems = computed(() => props.items || defaultItems)
const route = useRoute()

const isActive = (path: string) => route.path === path || route.path.startsWith(path + '/')

const icons: Record<string, string> = {
  home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  chart: 'M18 20V10 M12 20V4 M6 20v-6',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'
}
</script>

<template>
  <aside class="admin-sidebar">
    <div class="admin-sidebar-header">
      <slot name="logo">
        <span class="admin-logo">Admin</span>
      </slot>
    </div>
    
    <nav class="admin-nav">
      <NuxtLink 
        v-for="item in navItems" 
        :key="item.to"
        :to="item.to"
        class="admin-nav-item"
        :class="{ active: isActive(item.to) }"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path :d="icons[item.icon] || icons.home" />
        </svg>
        <span>{{ item.label }}</span>
        <span v-if="item.badge" class="admin-nav-badge">{{ item.badge }}</span>
      </NuxtLink>
    </nav>
    
    <div class="admin-sidebar-footer">
      <slot name="footer" />
    </div>
  </aside>
</template>

<style scoped>
.admin-sidebar {
  width: 240px;
  height: 100vh;
  background: #111;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
}

.admin-sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.admin-logo {
  font-weight: 700;
  font-size: 1.25rem;
}

.admin-nav {
  flex: 1;
  padding: 1rem 0;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  transition: all 0.2s;
}

.admin-nav-item:hover {
  color: white;
  background: rgba(255,255,255,0.05);
}

.admin-nav-item.active {
  color: white;
  background: rgba(255,255,255,0.1);
}

.admin-nav-badge {
  margin-left: auto;
  background: #3b82f6;
  color: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
}

.admin-sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}
</style>
