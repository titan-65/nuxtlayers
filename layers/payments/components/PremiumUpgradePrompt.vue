<script setup lang="ts">
/**
 * Premium upgrade prompt component.
 * Shows when a user tries to access licensed features without a valid key.
 */

defineProps<{
  layerName?: string
  feature?: string
}>()

const pricingUrl = 'https://nuxtlayers.dev/pricing'
</script>

<template>
  <div class="premium-upgrade-prompt">
    <div class="premium-upgrade-content">
      <div class="premium-icon">🔒</div>
      <h3 class="premium-title">Premium Feature</h3>
      <p class="premium-description">
        <template v-if="feature">
          <strong>{{ feature }}</strong> requires a valid license key.
        </template>
        <template v-else-if="layerName">
          <strong>{{ layerName }}</strong> is a premium layer.
        </template>
        <template v-else>
          This feature requires a valid license key.
        </template>
      </p>
      <p class="premium-subdescription">
        Upgrade to unlock all premium features and priority support.
      </p>
      <div class="premium-actions">
        <a :href="pricingUrl" target="_blank" class="premium-btn-primary">
          View Pricing →
        </a>
        <a href="https://nuxtlayers.dev/docs/licensing" target="_blank" class="premium-btn-secondary">
          Learn More
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.premium-upgrade-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(249, 115, 22, 0.05));
  border: 1px solid rgba(249, 115, 22, 0.3);
  border-radius: 12px;
  text-align: center;
}

.premium-upgrade-content {
  max-width: 400px;
}

.premium-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.premium-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
}

.premium-description {
  color: #ccc;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.premium-subdescription {
  color: #888;
  font-size: 0.8rem;
  margin-bottom: 1.5rem;
}

.premium-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.premium-btn-primary {
  background: #F97316;
  color: #000;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}

.premium-btn-primary:hover {
  background: #ea580c;
}

.premium-btn-secondary {
  background: transparent;
  color: #F97316;
  padding: 0.5rem 1.25rem;
  border: 1px solid #F97316;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.premium-btn-secondary:hover {
  background: rgba(249, 115, 22, 0.1);
}
</style>
