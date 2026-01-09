<script setup lang="ts">
/**
 * Sign-in page for Clerk authentication.
 * Uses Clerk's SignIn component for the UI.
 */
definePageMeta({
  layout: 'auth'
})

const route = useRoute()
const redirectUrl = computed(() => route.query.redirect as string || '/')
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>Sign In</h1>
        <p>Welcome back! Please sign in to continue.</p>
      </div>
      
      <ClientOnly>
        <SignIn :redirect-url="redirectUrl" />
        <template #fallback>
          <div class="auth-loading">Loading...</div>
        </template>
      </ClientOnly>
      
      <div class="auth-footer">
        <p>Don't have an account? <NuxtLink to="/sign-up">Sign up</NuxtLink></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f9fafb;
}

.auth-container {
  width: 100%;
  max-width: 400px;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #6b7280;
  font-size: 0.875rem;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.auth-footer a {
  color: #000;
  font-weight: 500;
}

.auth-loading {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}
</style>
