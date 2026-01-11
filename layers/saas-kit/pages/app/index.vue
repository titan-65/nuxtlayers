<script setup lang="ts">
/**
 * SaaS Dashboard - Main app dashboard with stats and activity
 */

definePageMeta({
  layout: 'saas'
})

useHead({ title: 'Dashboard - My SaaS App' })

const { user } = useFirebaseAuth()
const { subscription, isTrialing, daysRemaining, planLabel, fetchSubscription } = useSaasSubscription()
const teamStore = useSaasTeam()
const { currentTeam } = storeToRefs(teamStore)

onMounted(() => {
  fetchSubscription()
})

// Demo stats
const stats = ref([
  { label: 'Total Users', value: '2,847', change: '+12%', positive: true },
  { label: 'Active Projects', value: '23', change: '+3', positive: true },
  { label: 'Revenue', value: '$12,430', change: '+8%', positive: true },
  { label: 'Conversion', value: '4.2%', change: '-0.3%', positive: false }
])

// Demo activity
const recentActivity = ref([
  { id: 1, action: 'New user signup', user: 'john@example.com', time: '2 min ago' },
  { id: 2, action: 'Project created', user: 'jane@example.com', time: '15 min ago' },
  { id: 3, action: 'Payment received', user: 'bob@example.com', time: '1 hour ago' },
  { id: 4, action: 'Team member invited', user: 'alice@example.com', time: '2 hours ago' }
])
</script>

<template>
  <div class="saas-dashboard">
    <!-- Trial Banner -->
    <div v-if="isTrialing" class="saas-dashboard-trial-banner">
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>
          <strong>{{ daysRemaining }} days</strong> left in your {{ planLabel }} trial
        </span>
      </div>
      <NuxtLink to="/app/settings/billing" class="saas-trial-upgrade-btn">
        Upgrade Now
      </NuxtLink>
    </div>

    <!-- Header -->
    <div class="saas-dashboard-header">
      <div>
        <h1 class="saas-dashboard-title">
          Welcome back, {{ user?.displayName?.split(' ')[0] || 'there' }} 👋
        </h1>
        <p class="saas-dashboard-subtitle">
          Here's what's happening with {{ currentTeam?.name || 'your team' }} today.
        </p>
      </div>
      <NuxtLink to="/app/projects/new" class="saas-dashboard-cta">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New Project
      </NuxtLink>
    </div>

    <!-- Stats Grid -->
    <div class="saas-dashboard-stats">
      <div v-for="stat in stats" :key="stat.label" class="saas-stat-card">
        <div class="saas-stat-label">{{ stat.label }}</div>
        <div class="saas-stat-value">{{ stat.value }}</div>
        <div class="saas-stat-change" :class="stat.positive ? 'positive' : 'negative'">
          {{ stat.change }}
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="saas-dashboard-grid">
      <!-- Recent Activity -->
      <div class="saas-dashboard-card">
        <div class="saas-dashboard-card-header">
          <h2 class="saas-dashboard-card-title">Recent Activity</h2>
          <NuxtLink to="/app/activity" class="saas-dashboard-card-link">View all</NuxtLink>
        </div>
        <div class="saas-dashboard-card-content">
          <div v-for="activity in recentActivity" :key="activity.id" class="saas-activity-item">
            <div class="saas-activity-dot" />
            <div class="saas-activity-content">
              <div class="saas-activity-action">{{ activity.action }}</div>
              <div class="saas-activity-meta">{{ activity.user }} • {{ activity.time }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="saas-dashboard-card">
        <div class="saas-dashboard-card-header">
          <h2 class="saas-dashboard-card-title">Quick Actions</h2>
        </div>
        <div class="saas-dashboard-card-content">
          <div class="saas-quick-actions">
            <NuxtLink to="/app/settings/members" class="saas-quick-action">
              <div class="saas-quick-action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
              </div>
              <span>Invite Team Member</span>
            </NuxtLink>
            <NuxtLink to="/app/settings" class="saas-quick-action">
              <div class="saas-quick-action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09"/>
                </svg>
              </div>
              <span>Settings</span>
            </NuxtLink>
            <NuxtLink to="/app/settings/billing" class="saas-quick-action">
              <div class="saas-quick-action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
                </svg>
              </div>
              <span>Billing</span>
            </NuxtLink>
            <a href="https://nuxtlayers.dev/docs" target="_blank" class="saas-quick-action">
              <div class="saas-quick-action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <span>Documentation</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.saas-dashboard {
  max-width: 1200px;
}

.saas-dashboard-trial-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, rgba(249, 115, 22, 0.15), rgba(249, 115, 22, 0.05));
  border: 1px solid rgba(249, 115, 22, 0.3);
  border-radius: 12px;
  padding: 0.875rem 1.25rem;
  margin-bottom: 1.5rem;
  color: #F97316;
  font-size: 0.875rem;
}

.saas-trial-upgrade-btn {
  background: #F97316;
  color: #000;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.saas-trial-upgrade-btn:hover {
  background: #ea580c;
}

.saas-dashboard-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.saas-dashboard-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.25rem;
}

.saas-dashboard-subtitle {
  color: #888;
  font-size: 0.9rem;
}

.saas-dashboard-cta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #F97316;
  color: #000;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.saas-dashboard-cta:hover {
  background: #ea580c;
}

.saas-dashboard-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

@media (max-width: 1024px) {
  .saas-dashboard-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .saas-dashboard-stats {
    grid-template-columns: 1fr;
  }
  .saas-dashboard-header {
    flex-direction: column;
    gap: 1rem;
  }
}

.saas-stat-card {
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 1.25rem;
}

.saas-stat-label {
  font-size: 0.75rem;
  color: #888;
  text-transform: uppercase;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.saas-stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.25rem;
}

.saas-stat-change {
  font-size: 0.75rem;
  font-weight: 500;
}

.saas-stat-change.positive {
  color: #22c55e;
}

.saas-stat-change.negative {
  color: #ef4444;
}

.saas-dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .saas-dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.saas-dashboard-card {
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  overflow: hidden;
}

.saas-dashboard-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.saas-dashboard-card-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
}

.saas-dashboard-card-link {
  font-size: 0.75rem;
  color: #F97316;
  text-decoration: none;
}

.saas-dashboard-card-link:hover {
  text-decoration: underline;
}

.saas-dashboard-card-content {
  padding: 0.5rem 0;
}

.saas-activity-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  transition: background 0.2s;
}

.saas-activity-item:hover {
  background: rgba(255, 255, 255, 0.02);
}

.saas-activity-dot {
  width: 8px;
  height: 8px;
  background: #F97316;
  border-radius: 50%;
  margin-top: 0.375rem;
  flex-shrink: 0;
}

.saas-activity-action {
  font-size: 0.875rem;
  color: #fff;
  margin-bottom: 0.125rem;
}

.saas-activity-meta {
  font-size: 0.75rem;
  color: #666;
}

.saas-quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  padding: 0.75rem;
}

.saas-quick-action {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  color: #ccc;
  font-size: 0.8rem;
  text-decoration: none;
  transition: all 0.2s;
}

.saas-quick-action:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.saas-quick-action-icon {
  width: 36px;
  height: 36px;
  background: rgba(249, 115, 22, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F97316;
  flex-shrink: 0;
}
</style>
