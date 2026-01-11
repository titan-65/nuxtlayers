<script setup lang="ts">
/**
 * SaaS Header - Top bar with search and user menu
 */

const { user } = useFirebaseAuth()
</script>

<template>
  <div class="saas-header">
    <!-- Search -->
    <div class="saas-header-search">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </svg>
      <input 
        type="text" 
        placeholder="Search..."
        class="saas-header-search-input"
      />
      <kbd class="saas-header-search-kbd">⌘K</kbd>
    </div>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Notifications -->
    <button class="saas-header-icon-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
      </svg>
      <span class="saas-header-badge">3</span>
    </button>

    <!-- Help -->
    <button class="saas-header-icon-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
      </svg>
    </button>

    <!-- User Menu -->
    <SaasUserMenu />
  </div>
</template>

<style scoped>
.saas-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.saas-header-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 0 0.75rem;
  height: 36px;
  width: 280px;
  color: #666;
}

.saas-header-search:focus-within {
  border-color: rgba(249, 115, 22, 0.5);
}

.saas-header-search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.875rem;
  color: #fff;
}

.saas-header-search-input::placeholder {
  color: #555;
}

.saas-header-search-kbd {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 0.125rem 0.375rem;
  font-size: 0.65rem;
  font-family: inherit;
  color: #666;
}

.saas-header-icon-btn {
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
}

.saas-header-icon-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.saas-header-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  background: #F97316;
  border-radius: 8px;
  font-size: 0.6rem;
  font-weight: 700;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

@media (max-width: 768px) {
  .saas-header-search {
    display: none;
  }
}
</style>
