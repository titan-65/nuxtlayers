# @vantol/payments

Stripe payments layer with checkout, subscriptions, and customer portal.

## Features

- 💳 Stripe Checkout integration
- 🔄 Subscription management
- 👤 Customer portal
- 🪝 Webhook handler

## Installation

```bash
npx nuxt-layers add @vantol/payments
npm install stripe
```

## Setup

Add Stripe keys to `.env`:

```env
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```

## Usage

### Start Checkout

```vue
<script setup>
const { checkout, loading } = usePayments()
</script>

<template>
  <button @click="checkout('price_xxx')" :disabled="loading">
    Subscribe
  </button>
</template>
```

### Pricing Cards

```vue
<PricingCard
  name="Pro"
  price="$29"
  period="month"
  :features="['Feature 1', 'Feature 2']"
  priceId="price_xxx"
  popular
/>
```

### Customer Portal

```ts
const { openPortal } = usePayments()
await openPortal(customerId)
```

## License

MIT
