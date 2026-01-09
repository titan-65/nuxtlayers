# @vantol/auth

Firebase authentication layer for Nuxt applications with Google SSO, user state management, and admin role detection.

## Features

- 🔐 Google Sign-In (popup + redirect fallback)
- 👤 User state management
- 🛡️ Admin role detection
- 📱 Works on mobile

## Installation

```bash
npx nuxt-layers add @vantol/auth
```

## Setup

1. Add Firebase configuration to your `.env`:

```env
NUXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NUXT_PUBLIC_ADMIN_EMAILS=admin@example.com,another@example.com
```

2. Initialize Firebase in a plugin (if not already done):

```ts
// plugins/firebase.client.ts
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const app = initializeApp({
    apiKey: config.public.firebase.apiKey,
    authDomain: config.public.firebase.authDomain,
    projectId: config.public.firebase.projectId,
  })
  
  return {
    provide: {
      firebaseAuth: getAuth(app),
      firebaseGoogleProvider: new GoogleAuthProvider()
    }
  }
})
```

## Usage

```vue
<script setup>
const { user, loading, isAdmin, init, signInWithGoogle, signOut } = useFirebaseAuth()

onMounted(() => init())
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="user">
    <p>Welcome, {{ user.displayName }}</p>
    <p v-if="isAdmin">You are an admin</p>
    <button @click="signOut">Sign Out</button>
  </div>
  <button v-else @click="signInWithGoogle">Sign in with Google</button>
</template>
```

## License

MIT
