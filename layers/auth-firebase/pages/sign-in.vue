<script setup lang="ts">
/**
 * Sign-in page for Firebase authentication.
 */
definePageMeta({
  layout: 'auth'
})

const { user, loading, signInWithGoogle, init } = useFirebaseAuth()
const route = useRoute()
const error = ref('')

const redirectUrl = computed(() => route.query.redirect as string || '/')

onMounted(async () => {
  await init()
  // Redirect if already logged in
  if (user.value) {
    navigateTo(redirectUrl.value)
  }
})

const handleGoogleSignIn = async () => {
  error.value = ''
  try {
    await signInWithGoogle()
    navigateTo(redirectUrl.value)
  } catch (e: any) {
    error.value = e.message || 'Sign in failed'
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>Sign In</h1>
        <p>Welcome back! Sign in to continue.</p>
      </div>
      
      <div v-if="loading" class="auth-loading">
        <div class="auth-spinner"></div>
      </div>
      
      <template v-else>
        <div v-if="error" class="auth-error">{{ error }}</div>
        
        <div class="auth-buttons">
          <button @click="handleGoogleSignIn" class="auth-google-btn">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.065c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748z"/>
            </svg>
            Continue with Google
          </button>
        </div>
        
        <div class="auth-info">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </template>
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
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
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

.auth-loading {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.auth-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e5e7eb;
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.auth-error {
  background: #fef2f2;
  color: #b91c1c;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: center;
}

.auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.auth-google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.auth-google-btn:hover {
  background: #f9fafb;
}

.auth-info {
  margin-top: 2rem;
  text-align: center;
}

.auth-info p {
  font-size: 0.75rem;
  color: #9ca3af;
  line-height: 1.5;
}
</style>
