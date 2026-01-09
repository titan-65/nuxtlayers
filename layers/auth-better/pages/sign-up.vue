<script setup lang="ts">
/**
 * Sign-up page for Better Auth.
 */
definePageMeta({
  layout: 'auth'
})

const { signUp, loading } = useBetterAuth()
const route = useRoute()

const name = ref('')
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
    await signUp({ 
      email: email.value, 
      password: password.value,
      name: name.value || undefined
    })
    navigateTo(redirectUrl.value)
  } catch (e: any) {
    error.value = e.message || 'Registration failed'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>Create Account</h1>
        <p>Get started with your account today.</p>
      </div>
      
      <div v-if="error" class="auth-error">{{ error }}</div>
      
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="auth-field">
          <label for="name">Name (optional)</label>
          <input id="name" v-model="name" type="text" placeholder="Your name" />
        </div>
        
        <div class="auth-field">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" placeholder="you@example.com" required />
        </div>
        
        <div class="auth-field">
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" placeholder="••••••••" required />
        </div>
        
        <button type="submit" class="auth-submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>
      
      <div class="auth-footer">
        <p>Already have an account? <NuxtLink to="/sign-in">Sign in</NuxtLink></p>
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
