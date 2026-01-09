# @vantol/blog

A full-featured blog layer for Nuxt applications with Firebase-powered real-time features.

## Features

- 📝 Blog post system with @nuxt/content
- 💬 Real-time comments (Firebase)
- 👀 View counter with deduplication
- 🚀 Post reactions (likes)
- 📧 Newsletter subscription
- 🔖 Bookmark posts locally
- 👥 Live presence indicator

## Installation

```bash
npx nuxt-layers add @vantol/blog
```

## Setup

1. Add Firebase configuration to your `.env`:

```env
NUXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NUXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NUXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
```

2. The layer is automatically added to `nuxt.config.ts`

## Components

- `ViewCounter` — Displays and tracks post views
- `PresenceIndicator` — Shows live readers
- `RealtimeComments` — Comment system with auth
- `ReactionButton` — Like/reaction button
- `BookmarkButton` — Save posts locally
- `Newsletter` — Email subscription form

## Composables

- `useRealtimeViews(slug)` — Track and display views
- `usePresence(slug)` — Live presence tracking
- `useRealtimeComments(slug)` — Comments CRUD
- `useReactions(slug)` — Likes/reactions
- `useBookmarks()` — Local bookmarks
- `useNewsletter()` — Newsletter subscriptions

## License

MIT
