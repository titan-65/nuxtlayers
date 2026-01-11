<script setup lang="ts">
/**
 * Analytics Dashboard - Overview page
 */

useHead({ title: 'Analytics Dashboard' })

const loading = ref(true)
const dateRange = ref('7d')

// Demo data (in production, fetch from API)
const stats = ref({
  pageViews: 12847,
  uniqueVisitors: 3291,
  avgSessionDuration: '2m 34s',
  bounceRate: '42%'
})

const pageViewsData = ref([
  { date: 'Mon', views: 1245, visitors: 412 },
  { date: 'Tue', views: 1567, visitors: 489 },
  { date: 'Wed', views: 1834, visitors: 521 },
  { date: 'Thu', views: 2012, visitors: 567 },
  { date: 'Fri', views: 1756, visitors: 498 },
  { date: 'Sat', views: 1234, visitors: 345 },
  { date: 'Sun', views: 1199, visitors: 359 }
])

const topPages = ref([
  { path: '/', views: 4521, percentage: 35.2 },
  { path: '/pricing', views: 2134, percentage: 16.6 },
  { path: '/layers', views: 1876, percentage: 14.6 },
  { path: '/docs', views: 1543, percentage: 12.0 },
  { path: '/blog', views: 1234, percentage: 9.6 }
])

const topEvents = ref([
  { name: 'cta_click', count: 892, change: '+12%' },
  { name: 'signup', count: 567, change: '+8%' },
  { name: 'download', count: 423, change: '+15%' },
  { name: 'share', count: 234, change: '-3%' }
])

const topReferrers = ref([
  { source: 'google.com', visits: 2341, percentage: 42 },
  { source: 'twitter.com', visits: 876, percentage: 16 },
  { source: 'github.com', visits: 654, percentage: 12 },
  { source: 'direct', visits: 543, percentage: 10 },
  { source: 'nuxt.com', visits: 432, percentage: 8 }
])

onMounted(() => {
  loading.value = false
})

const maxViews = computed(() => Math.max(...pageViewsData.value.map(d => d.views)))
</script>

<template>
  <div class="analytics-page">
    <!-- Header -->
    <div class="analytics-header">
      <div>
        <h1 class="analytics-title">Analytics</h1>
        <p class="analytics-subtitle">Track your website performance</p>
      </div>
      <div class="analytics-header-actions">
        <select v-model="dateRange" class="analytics-select">
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
        <button class="analytics-export-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="analytics-stats">
      <div class="analytics-stat-card">
        <div class="analytics-stat-icon blue">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        <div>
          <div class="analytics-stat-value">{{ stats.pageViews.toLocaleString() }}</div>
          <div class="analytics-stat-label">Page Views</div>
        </div>
      </div>

      <div class="analytics-stat-card">
        <div class="analytics-stat-icon green">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div>
          <div class="analytics-stat-value">{{ stats.uniqueVisitors.toLocaleString() }}</div>
          <div class="analytics-stat-label">Unique Visitors</div>
        </div>
      </div>

      <div class="analytics-stat-card">
        <div class="analytics-stat-icon purple">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div>
          <div class="analytics-stat-value">{{ stats.avgSessionDuration }}</div>
          <div class="analytics-stat-label">Avg. Session</div>
        </div>
      </div>

      <div class="analytics-stat-card">
        <div class="analytics-stat-icon orange">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
          </svg>
        </div>
        <div>
          <div class="analytics-stat-value">{{ stats.bounceRate }}</div>
          <div class="analytics-stat-label">Bounce Rate</div>
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div class="analytics-card">
      <div class="analytics-card-header">
        <h2 class="analytics-card-title">Page Views & Visitors</h2>
        <div class="analytics-card-legend">
          <span class="legend-item"><span class="legend-dot blue"></span> Page Views</span>
          <span class="legend-item"><span class="legend-dot green"></span> Visitors</span>
        </div>
      </div>
      <div class="analytics-chart">
        <div v-for="day in pageViewsData" :key="day.date" class="chart-bar-group">
          <div class="chart-bars">
            <div class="chart-bar blue" :style="{ height: (day.views / maxViews * 100) + '%' }"></div>
            <div class="chart-bar green" :style="{ height: (day.visitors / maxViews * 100) + '%' }"></div>
          </div>
          <div class="chart-label">{{ day.date }}</div>
        </div>
      </div>
    </div>

    <!-- Data Tables -->
    <div class="analytics-grid">
      <!-- Top Pages -->
      <div class="analytics-card">
        <div class="analytics-card-header">
          <h2 class="analytics-card-title">Top Pages</h2>
          <NuxtLink to="/analytics/pages" class="analytics-card-link">View all</NuxtLink>
        </div>
        <div class="analytics-table">
          <div v-for="page in topPages" :key="page.path" class="analytics-table-row">
            <div class="analytics-table-path">{{ page.path }}</div>
            <div class="analytics-table-bar">
              <div class="analytics-bar" :style="{ width: page.percentage + '%' }"></div>
            </div>
            <div class="analytics-table-value">{{ page.views.toLocaleString() }}</div>
          </div>
        </div>
      </div>

      <!-- Top Events -->
      <div class="analytics-card">
        <div class="analytics-card-header">
          <h2 class="analytics-card-title">Top Events</h2>
          <NuxtLink to="/analytics/events" class="analytics-card-link">View all</NuxtLink>
        </div>
        <div class="analytics-table">
          <div v-for="event in topEvents" :key="event.name" class="analytics-table-row">
            <div class="analytics-table-path">
              <code class="analytics-event-name">{{ event.name }}</code>
            </div>
            <div class="analytics-table-change" :class="event.change.startsWith('+') ? 'positive' : 'negative'">
              {{ event.change }}
            </div>
            <div class="analytics-table-value">{{ event.count.toLocaleString() }}</div>
          </div>
        </div>
      </div>

      <!-- Traffic Sources -->
      <div class="analytics-card">
        <div class="analytics-card-header">
          <h2 class="analytics-card-title">Traffic Sources</h2>
        </div>
        <div class="analytics-table">
          <div v-for="ref in topReferrers" :key="ref.source" class="analytics-table-row">
            <div class="analytics-table-path">{{ ref.source }}</div>
            <div class="analytics-table-bar">
              <div class="analytics-bar purple" :style="{ width: ref.percentage + '%' }"></div>
            </div>
            <div class="analytics-table-value">{{ ref.visits.toLocaleString() }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.analytics-page { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }

.analytics-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
.analytics-title { font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 0.25rem; }
.analytics-subtitle { color: #888; font-size: 0.875rem; }
.analytics-header-actions { display: flex; gap: 0.75rem; }
.analytics-select { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0.5rem 0.75rem; color: #fff; font-size: 0.8rem; cursor: pointer; }
.analytics-export-btn { display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #ccc; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
.analytics-export-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

.analytics-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
@media (max-width: 1024px) { .analytics-stats { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .analytics-stats { grid-template-columns: 1fr; } }

.analytics-stat-card { display: flex; align-items: center; gap: 1rem; background: #111; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 1.25rem; }
.analytics-stat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.analytics-stat-icon.blue { background: rgba(59,130,246,0.15); color: #3b82f6; }
.analytics-stat-icon.green { background: rgba(34,197,94,0.15); color: #22c55e; }
.analytics-stat-icon.purple { background: rgba(139,92,246,0.15); color: #8b5cf6; }
.analytics-stat-icon.orange { background: rgba(249,115,22,0.15); color: #F97316; }
.analytics-stat-value { font-size: 1.5rem; font-weight: 700; color: #fff; }
.analytics-stat-label { font-size: 0.75rem; color: #888; }

.analytics-card { background: #111; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; overflow: hidden; margin-bottom: 1.5rem; }
.analytics-card-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
.analytics-card-title { font-size: 0.9rem; font-weight: 600; color: #fff; }
.analytics-card-link { font-size: 0.75rem; color: #F97316; text-decoration: none; }
.analytics-card-legend { display: flex; gap: 1rem; }
.legend-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: #888; }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; }
.legend-dot.blue { background: #3b82f6; }
.legend-dot.green { background: #22c55e; }

.analytics-chart { display: flex; justify-content: space-between; align-items: flex-end; padding: 1.5rem 1.25rem; height: 200px; gap: 0.5rem; }
.chart-bar-group { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; }
.chart-bars { display: flex; gap: 4px; height: 100%; align-items: flex-end; }
.chart-bar { width: 16px; border-radius: 4px 4px 0 0; transition: height 0.3s ease; }
.chart-bar.blue { background: #3b82f6; }
.chart-bar.green { background: #22c55e; }
.chart-label { font-size: 0.7rem; color: #666; margin-top: 0.5rem; }

.analytics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
.analytics-grid .analytics-card:last-child { grid-column: 1 / -1; }
@media (max-width: 768px) { .analytics-grid { grid-template-columns: 1fr; } }

.analytics-table { padding: 0.5rem 0; }
.analytics-table-row { display: flex; align-items: center; padding: 0.625rem 1.25rem; gap: 1rem; }
.analytics-table-row:hover { background: rgba(255,255,255,0.02); }
.analytics-table-path { flex: 1; font-size: 0.8rem; color: #fff; font-weight: 500; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.analytics-table-bar { flex: 1; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; }
.analytics-bar { height: 100%; background: #F97316; border-radius: 3px; }
.analytics-bar.purple { background: #8b5cf6; }
.analytics-table-value { font-size: 0.8rem; color: #888; min-width: 60px; text-align: right; }
.analytics-table-change { font-size: 0.75rem; font-weight: 500; min-width: 50px; text-align: center; }
.analytics-table-change.positive { color: #22c55e; }
.analytics-table-change.negative { color: #ef4444; }
.analytics-event-name { background: rgba(255,255,255,0.05); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; }
</style>
