<script setup lang="ts">
/**
 * Sign-in page for Better Auth.
 * Handles email/password and social sign-in.
 */
definePageMeta({
  layout: 'auth'
})

const { signIn, signInWithProvider, loading } = useBetterAuth()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref('')
const isSubmitting = ref(false)

const redirectUrl = computed(() => route.query.redirect as string || '/')

const handleSubmit = async () => {
  if (!email.value || !password.value) return
  
  isSubmitting.value = true
  error.value = ''
  
  try {
    await signIn({ email: email.value, password: password.value })
    navigateTo(redirectUrl.value)
  } catch (e: any) {
    error.value = e.message || 'Invalid email or password'
  } finally {
    isSubmitting.value = false
  }
}

const handleSocialSignIn = async (provider: 'google' | 'github') => {
  try {
    await signInWithProvider(provider)
  } catch (e: any) {
    error.value = e.message || 'Social sign-in failed'
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>Sign In</h1>
        <p>Welcome back! Please sign in to continue.</p>
      </div>
      
      <div v-if="error" class="auth-error">{{ error }}</div>
      
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="auth-field">
          <label for="email">Email</label>
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            placeholder="you@example.com" 
            required 
          />
        </div>
        
        <div class="auth-field">
          <label for="password">Password</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            placeholder="••••••••" 
            required 
          />
        </div>
        
        <button type="submit" class="auth-submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
      
      <div class="auth-divider">
        <span>or continue with</span>
      </div>
      
      <div class="auth-social">
        <button @click="handleSocialSignIn('google')" class="auth-social-btn">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.065c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748z"/></svg>
          Google
        </button>
        <button @click="handleSocialSignIn('github')" class="auth-social-btn">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
          GitHub
        </button>
      </div>
      
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

.auth-error {
  background: #fef2f2;
  color: #b91c1c;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-field label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.375rem;
}

.auth-field input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
}

.auth-field input:focus {
  outline: none;
  border-color: #000;
}

.auth-submit {
  width: 100%;
  padding: 0.75rem;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.auth-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.auth-divider span {
  font-size: 0.75rem;
  color: #9ca3af;
}

.auth-social {
  display: flex;
  gap: 0.75rem;
}

.auth-social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.auth-social-btn:hover {
  background: #f9fafb;
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
</style>
