<script setup lang="ts">
/**
 * User button component for Clerk.
 * Shows user avatar when signed in, or sign-in button when not.
 */
const { user, loading, signOut } = useClerkAuth()

const showMenu = ref(false)
</script>

<template>
  <ClientOnly>
    <div v-if="loading" class="auth-user-loading">
      <div class="auth-spinner"></div>
    </div>
    
    <div v-else-if="user" class="auth-user-button" @click="showMenu = !showMenu">
      <img :src="user.photoURL" :alt="user.displayName" class="auth-avatar" />
      
      <div v-if="showMenu" class="auth-dropdown">
        <div class="auth-user-info">
          <strong>{{ user.displayName }}</strong>
          <span>{{ user.email }}</span>
        </div>
        <hr />
        <button @click="signOut" class="auth-signout">Sign out</button>
      </div>
    </div>
    
    <NuxtLink v-else to="/sign-in" class="auth-signin-button">
      Sign in
    </NuxtLink>
    
    <template #fallback>
      <div class="auth-user-loading">...</div>
    </template>
  </ClientOnly>
</template>

<style scoped>
.auth-user-button {
  position: relative;
  cursor: pointer;
}

.auth-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.auth-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 8px;
  padding: 0.5rem;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 1000;
}

.auth-user-info {
  padding: 0.5rem;
}

.auth-user-info strong {
  display: block;
  font-size: 0.875rem;
}

.auth-user-info span {
  font-size: 0.75rem;
  color: #666;
}

.auth-signout {
  width: 100%;
  padding: 0.5rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 0.875rem;
  color: #666;
}

.auth-signout:hover {
  color: #ef4444;
}

.auth-signin-button {
  padding: 0.5rem 1rem;
  background: #000;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.875rem;
}

.auth-user-loading {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0,0,0,0.1);
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
