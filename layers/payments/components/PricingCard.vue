<script setup lang="ts">
/**
 * Pricing card component.
 */
defineProps<{
  name: string
  price: string
  period?: string
  features: string[]
  priceId: string
  popular?: boolean
}>()

const { checkout, loading } = usePayments()
</script>

<template>
  <div class="pricing-card" :class="{ popular }">
    <div v-if="popular" class="pricing-badge">Most Popular</div>
    <h3 class="pricing-name">{{ name }}</h3>
    <div class="pricing-price">
      <span class="pricing-amount">{{ price }}</span>
      <span v-if="period" class="pricing-period">/{{ period }}</span>
    </div>
    <ul class="pricing-features">
      <li v-for="feature in features" :key="feature">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        {{ feature }}
      </li>
    </ul>
    <button @click="checkout(priceId)" :disabled="loading" class="pricing-button">
      {{ loading ? 'Loading...' : 'Get Started' }}
    </button>
  </div>
</template>

<style scoped>
.pricing-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 2rem;
  position: relative;
}

.pricing-card.popular {
  border-color: #000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.pricing-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #000;
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.pricing-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.pricing-price {
  margin-bottom: 1.5rem;
}

.pricing-amount {
  font-size: 2.5rem;
  font-weight: 700;
}

.pricing-period {
  color: #6b7280;
  font-size: 0.875rem;
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
}

.pricing-features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  color: #374151;
}

.pricing-features svg {
  color: #10b981;
}

.pricing-button {
  width: 100%;
  padding: 0.875rem;
  background: #000;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.pricing-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
