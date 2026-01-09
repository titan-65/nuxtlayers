# @vantol/auth-better

Better Auth layer for Nuxt with email/password, social SSO, and database-backed sessions.

## Features

- 📧 Email/password authentication
- 🔐 Social SSO (Google, GitHub)
- 🗄️ Database-backed sessions
- 🛡️ Auth middleware

## Installation

```bash
npx nuxt-layers add @vantol/auth-better
npm install better-auth
```

## Setup

Add secrets to `.env`:

```env
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
NUXT_PUBLIC_ADMIN_EMAILS=admin@example.com
```

Configure database in `server/utils/auth.ts`:

```ts
// Override with your database adapter
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db'

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg' })
})
```

## Usage

```vue
<script setup>
const { user, loading, signIn, signUp, signInWithProvider, signOut } = useBetterAuth()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  await signIn({ email: email.value, password: password.value })
}
</script>

<template>
  <div v-if="user">
    Welcome, {{ user.displayName }}
    <button @click="signOut">Sign out</button>
  </div>
  <form v-else @submit.prevent="handleLogin">
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button type="submit">Sign in</button>
    <button type="button" @click="signInWithProvider('google')">Google</button>
  </form>
</template>
```

### Protect Routes

```ts
definePageMeta({
  middleware: 'auth'
})
```

## License

MIT
