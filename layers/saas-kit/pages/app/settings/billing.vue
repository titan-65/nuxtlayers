<script setup lang="ts">
/**
 * Billing Settings - Subscription and payment management
 */

definePageMeta({
  layout: 'saas'
})

useHead({ title: 'Billing - My SaaS App' })

const route = useRoute()
const { subscription, isTrialing, daysRemaining, planLabel, openBillingPortal, fetchSubscription } = useSaasSubscription()

const tabs = [
  { name: 'General', href: '/app/settings' },
  { name: 'Team', href: '/app/settings/team' },
  { name: 'Members', href: '/app/settings/members' },
  { name: 'Billing', href: '/app/settings/billing' }
]

const isActiveTab = (href: string) => {
  if (href === '/app/settings') return route.path === href
  return route.path.startsWith(href)
}

onMounted(() => {
  fetchSubscription()
})

const plans = [
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For professional developers',
    features: ['All core features', 'Premium layers', 'Priority support', '5 team members']
  },
  {
    id: 'team',
    name: 'Team',
    price: '$99',
    period: '/month',
    description: 'For growing teams',
    features: ['Everything in Pro', 'Unlimited team members', 'White-label options', 'Dedicated support'],
    popular: true
  }
]

const invoices = ref([
  { id: 'INV-001', date: '2024-01-01', amount: '$29.00', status: 'Paid' },
  { id: 'INV-002', date: '2024-02-01', amount: '$29.00', status: 'Paid' },
  { id: 'INV-003', date: '2024-03-01', amount: '$29.00', status: 'Upcoming' }
])
</script>

<template>
  <div class="settings-page">
    <div class="settings-header">
      <h1 class="settings-title">Settings</h1>
      <p class="settings-subtitle">Manage your account and preferences</p>
    </div>

    <div class="settings-tabs">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.name"
        :to="tab.href"
        class="settings-tab"
        :class="{ active: isActiveTab(tab.href) }"
      >
        {{ tab.name }}
      </NuxtLink>
    </div>

    <div class="settings-content">
      <!-- Current Plan -->
      <div class="billing-section">
        <h2 class="billing-section-title">Current Plan</h2>
        
        <div class="billing-current-plan">
          <div class="billing-plan-info">
            <div class="billing-plan-badge" :class="subscription.plan">
              {{ planLabel }}
            </div>
            <div class="billing-plan-status">
              <span v-if="isTrialing" class="text-orange-500">
                Trial • {{ daysRemaining }} days remaining
              </span>
              <span v-else-if="subscription.status === 'active'" class="text-green-500">
                Active
              </span>
              <span v-else class="text-red-500">
                {{ subscription.status }}
              </span>
            </div>
          </div>
          <button 
            class="billing-manage-btn"
            @click="openBillingPortal"
          >
            Manage Subscription
          </button>
        </div>
      </div>

      <div class="billing-divider" />

      <!-- Plans -->
      <div class="billing-section">
        <h2 class="billing-section-title">Available Plans</h2>
        <p class="billing-section-desc">Choose the plan that works best for you</p>

        <div class="billing-plans">
          <div 
            v-for="plan in plans" 
            :key="plan.id" 
            class="billing-plan-card"
            :class="{ popular: plan.popular, current: subscription.plan === plan.id }"
          >
            <div v-if="plan.popular" class="billing-plan-popular">Most Popular</div>
            <div class="billing-plan-name">{{ plan.name }}</div>
            <div class="billing-plan-price">
              <span class="billing-plan-amount">{{ plan.price }}</span>
              <span class="billing-plan-period">{{ plan.period }}</span>
            </div>
            <p class="billing-plan-desc">{{ plan.description }}</p>
            <ul class="billing-plan-features">
              <li v-for="feature in plan.features" :key="feature">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {{ feature }}
              </li>
            </ul>
            <NuxtLink 
              v-if="subscription.plan !== plan.id"
              :to="`/checkout?plan=${plan.id}`" 
              class="billing-plan-btn"
            >
              Upgrade to {{ plan.name }}
            </NuxtLink>
            <div v-else class="billing-plan-current">Current Plan</div>
          </div>
        </div>
      </div>

      <div class="billing-divider" />

      <!-- Invoices -->
      <div class="billing-section">
        <h2 class="billing-section-title">Billing History</h2>
        
        <div class="billing-invoices">
          <div class="billing-invoice-header">
            <span>Invoice</span>
            <span>Date</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          <div v-for="invoice in invoices" :key="invoice.id" class="billing-invoice-row">
            <span class="billing-invoice-id">{{ invoice.id }}</span>
            <span>{{ invoice.date }}</span>
            <span>{{ invoice.amount }}</span>
            <span 
              class="billing-invoice-status"
              :class="invoice.status.toLowerCase()"
            >
              {{ invoice.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page { max-width: 900px; }
.settings-header { margin-bottom: 1.5rem; }
.settings-title { font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 0.25rem; }
.settings-subtitle { color: #888; font-size: 0.875rem; }
.settings-tabs { display: flex; gap: 0.25rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.settings-tab { padding: 0.75rem 1rem; font-size: 0.875rem; color: #888; text-decoration: none; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.2s; }
.settings-tab:hover { color: #fff; }
.settings-tab.active { color: #F97316; border-bottom-color: #F97316; }
.settings-content { background: #111; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1.5rem; }

.billing-section { padding: 0.5rem 0; }
.billing-section-title { font-size: 1rem; font-weight: 600; color: #fff; margin-bottom: 0.25rem; }
.billing-section-desc { font-size: 0.8rem; color: #888; margin-bottom: 1.25rem; }
.billing-divider { height: 1px; background: rgba(255, 255, 255, 0.06); margin: 1.5rem 0; }

.billing-current-plan { display: flex; align-items: center; justify-content: space-between; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 10px; padding: 1rem 1.25rem; margin-top: 0.75rem; }
.billing-plan-info { display: flex; align-items: center; gap: 1rem; }
.billing-plan-badge { padding: 0.375rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
.billing-plan-badge.pro { background: rgba(249, 115, 22, 0.2); color: #F97316; }
.billing-plan-badge.team { background: rgba(139, 92, 246, 0.2); color: #8b5cf6; }
.billing-plan-badge.free { background: rgba(255, 255, 255, 0.1); color: #888; }
.billing-plan-status { font-size: 0.8rem; }
.billing-manage-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
.billing-manage-btn:hover { background: rgba(255, 255, 255, 0.1); }

.billing-plans { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 1rem; }
@media (max-width: 768px) { .billing-plans { grid-template-columns: 1fr; } }
.billing-plan-card { position: relative; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1.5rem; }
.billing-plan-card.popular { border-color: rgba(249, 115, 22, 0.5); }
.billing-plan-card.current { border-color: rgba(34, 197, 94, 0.5); }
.billing-plan-popular { position: absolute; top: -8px; right: 1rem; background: #F97316; color: #000; font-size: 0.65rem; font-weight: 700; padding: 0.25rem 0.5rem; border-radius: 4px; text-transform: uppercase; }
.billing-plan-name { font-size: 1.125rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem; }
.billing-plan-price { margin-bottom: 0.5rem; }
.billing-plan-amount { font-size: 2rem; font-weight: 700; color: #fff; }
.billing-plan-period { font-size: 0.875rem; color: #888; }
.billing-plan-desc { font-size: 0.8rem; color: #888; margin-bottom: 1rem; }
.billing-plan-features { list-style: none; padding: 0; margin: 0 0 1.25rem 0; }
.billing-plan-features li { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #ccc; padding: 0.25rem 0; }
.billing-plan-features svg { color: #22c55e; flex-shrink: 0; }
.billing-plan-btn { display: block; text-align: center; background: #F97316; color: #000; padding: 0.625rem; border-radius: 8px; font-size: 0.8rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
.billing-plan-btn:hover { background: #ea580c; }
.billing-plan-current { text-align: center; padding: 0.625rem; font-size: 0.8rem; color: #22c55e; font-weight: 500; }

.billing-invoices { margin-top: 0.75rem; }
.billing-invoice-header, .billing-invoice-row { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; padding: 0.75rem 1rem; font-size: 0.8rem; }
.billing-invoice-header { color: #888; text-transform: uppercase; font-weight: 500; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.billing-invoice-row { color: #ccc; border-bottom: 1px solid rgba(255, 255, 255, 0.03); }
.billing-invoice-row:hover { background: rgba(255, 255, 255, 0.02); }
.billing-invoice-id { color: #fff; font-weight: 500; }
.billing-invoice-status.paid { color: #22c55e; }
.billing-invoice-status.upcoming { color: #F97316; }
</style>
