/**
 * Analytics tracking composable
 * Privacy-focused, cookie-free analytics
 */

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp?: string
}

export interface PageView {
  path: string
  referrer?: string
  timestamp: string
}

export const useAnalytics = () => {
  const config = useRuntimeConfig()
  const route = useRoute()
  const enabled = computed(() => config.public.analytics?.enabled !== false)

  // Track page view
  const trackPageView = async (path?: string) => {
    if (!enabled.value) return

    const pageView: PageView = {
      path: path || route.path,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      timestamp: new Date().toISOString()
    }

    try {
      await $fetch('/api/analytics/pageview', {
        method: 'POST',
        body: pageView
      })
    } catch (error) {
      console.warn('Failed to track page view:', error)
    }
  }

  // Track custom event
  const trackEvent = async (name: string, properties?: Record<string, any>) => {
    if (!enabled.value) return

    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: new Date().toISOString()
    }

    try {
      await $fetch('/api/analytics/event', {
        method: 'POST',
        body: event
      })
    } catch (error) {
      console.warn('Failed to track event:', error)
    }
  }

  // Auto-track page views on route change
  if (import.meta.client && config.public.analytics?.trackPageViews) {
    watch(() => route.path, () => {
      trackPageView()
    })
  }

  return {
    enabled,
    trackPageView,
    trackEvent
  }
}
