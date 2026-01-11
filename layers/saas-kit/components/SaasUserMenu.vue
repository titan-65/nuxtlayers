<script setup lang="ts">
/**
 * SaaS User Menu - User dropdown with profile and actions
 */

const { user, logout } = useFirebaseAuth()

const dropdownOpen = ref(false)

const handleLogout = async () => {
  await logout()
  navigateTo('/login')
}

// Close dropdown on outside click
const dropdownRef = ref<HTMLElement>()
onClickOutside(dropdownRef, () => {
  dropdownOpen.value = false
})
</script>

<template>
  <div ref="dropdownRef" class="user-menu">
    <button 
      class="user-menu-trigger"
      @click="dropdownOpen = !dropdownOpen"
    >
      <img 
        v-if="user?.photoURL" 
        :src="user.photoURL" 
        :alt="user.displayName || 'User'"
        class="user-menu-avatar"
      />
      <div v-else class="user-menu-avatar user-menu-avatar-fallback">
        {{ user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U' }}
      </div>
    </button>

    <!-- Dropdown -->
    <Transition name="dropdown">
      <div v-if="dropdownOpen" class="user-menu-dropdown">
        <!-- User Info -->
        <div class="user-menu-info">
          <img 
            v-if="user?.photoURL" 
            :src="user.photoURL" 
            :alt="user.displayName || 'User'"
            class="user-menu-avatar-lg"
          />
          <div v-else class="user-menu-avatar-lg user-menu-avatar-fallback">
            {{ user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U' }}
          </div>
          <div>
            <div class="user-menu-name">{{ user?.displayName || 'User' }}</div>
            <div class="user-menu-email">{{ user?.email }}</div>
          </div>
        </div>

        <div class="user-menu-divider" />

        <!-- Links -->
        <NuxtLink to="/app/settings" class="user-menu-item" @click="dropdownOpen = false">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 12v-6m-9 3h6m12 0h-6m-3-9a9 9 0 0 0-9 9m9-9a9 9 0 0 1 9 9"/>
          </svg>
          Profile Settings
        </NuxtLink>
        
        <NuxtLink to="/app/settings/billing" class="user-menu-item" @click="dropdownOpen = false">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
          </svg>
          Billing
        </NuxtLink>

        <a href="https://nuxtlayers.dev/docs" target="_blank" class="user-menu-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
          </svg>
          Documentation
        </a>

        <div class="user-menu-divider" />

        <button class="user-menu-item user-menu-item-danger" @click="handleLogout">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
          </svg>
          Sign Out
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.user-menu {
  position: relative;
}

.user-menu-trigger {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  border-radius: 50%;
  transition: opacity 0.2s;
}

.user-menu-trigger:hover {
  opacity: 0.8;
}

.user-menu-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-menu-avatar-lg {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.user-menu-avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #F97316, #ea580c);
  color: #000;
  font-weight: 700;
  font-size: 0.875rem;
}

.user-menu-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 240px;
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.user-menu-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
}

.user-menu-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: #fff;
}

.user-menu-email {
  font-size: 0.75rem;
  color: #888;
}

.user-menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
}

.user-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: #ccc;
  font-size: 0.875rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.user-menu-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.user-menu-item-danger {
  color: #ef4444;
}

.user-menu-item-danger:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
