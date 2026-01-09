# @vantol/auth-clerk

Clerk authentication layer for Nuxt with social SSO, user management components, and session handling.

## Features

- 🔐 Social SSO (Google, GitHub, etc.)
- 👤 Pre-built UI components
- 🛡️ Auth middleware for protected routes
- 📱 Mobile-friendly

## Installation

```bash
npx nuxt-layers add @vantol/auth-clerk
npm install @clerk/nuxt
```

## Setup

Add Clerk keys to `.env`:

```env
NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NUXT_PUBLIC_ADMIN_EMAILS=admin@example.com
```

## Usage

### Composable

```vue
<script setup>
const { user, loading, isAdmin, signIn, signOut } = useClerkAuth()
</script>

<template>
  <div v-if="user">
    Welcome, {{ user.displayName }}
    <button @click="signOut">Sign out</button>
  </div>
  <button v-else @click="signIn">Sign in</button>
</template>
```

### Components

```vue
<!-- User button with dropdown -->
<AuthUserButton />
```

### Protect Routes

```ts
// pages/dashboard.vue
definePageMeta({
  middleware: 'auth'
})
```

### Clerk Components

You can also use Clerk's built-in components:

```vue
<SignInButton />
<SignUpButton />
<UserButton />
```

## License

MIT
