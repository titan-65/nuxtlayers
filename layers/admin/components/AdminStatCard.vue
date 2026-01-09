<script setup lang="ts">
/**
 * Stats card for admin dashboard.
 */
defineProps<{
  title: string
  value: string | number
  change?: number
  icon?: string
}>()
</script>

<template>
  <div class="admin-stat-card">
    <div class="admin-stat-header">
      <span class="admin-stat-title">{{ title }}</span>
      <div v-if="icon" class="admin-stat-icon">
        <slot name="icon" />
      </div>
    </div>
    <div class="admin-stat-value">{{ value }}</div>
    <div v-if="change !== undefined" class="admin-stat-change" :class="change >= 0 ? 'positive' : 'negative'">
      <span>{{ change >= 0 ? '+' : '' }}{{ change }}%</span>
      <span class="admin-stat-period">vs last month</span>
    </div>
  </div>
</template>

<style scoped>
.admin-stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
}

.admin-stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.admin-stat-title {
  font-size: 0.875rem;
  color: #6b7280;
}

.admin-stat-icon {
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.admin-stat-change {
  font-size: 0.875rem;
  display: flex;
  gap: 0.5rem;
}

.admin-stat-change.positive {
  color: #10b981;
}

.admin-stat-change.negative {
  color: #ef4444;
}

.admin-stat-period {
  color: #9ca3af;
}
</style>
