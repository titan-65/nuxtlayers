<script setup lang="ts">
/**
 * Admin dashboard index page.
 */
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const stats = ref([
  { title: 'Total Users', value: '1,234', change: 12 },
  { title: 'Revenue', value: '$45,678', change: 8 },
  { title: 'Orders', value: '567', change: -3 },
  { title: 'Active Sessions', value: '89', change: 15 }
])
</script>

<template>
  <div class="admin-dashboard">
    <header class="admin-header">
      <h1>Dashboard</h1>
      <p>Welcome back! Here's what's happening.</p>
    </header>

    <div class="admin-stats-grid">
      <AdminStatCard
        v-for="stat in stats"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :change="stat.change"
      />
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard {
  max-width: 1200px;
}

.admin-header {
  margin-bottom: 2rem;
}

.admin-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.admin-header p {
  color: #6b7280;
  font-size: 0.875rem;
}

.admin-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}
</style>
