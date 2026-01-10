/**
 * License validation composable for premium layers.
 * 
 * @example
 * ```ts
 * const { isLicensed, plan, features, checkLicense } = useLicense('@vantol/payments')
 * 
 * // Check on mount
 * onMounted(() => checkLicense())
 * 
 * // Gate premium features
 * <template v-if="isLicensed">
 *   <PremiumFeature />
 * </template>
 * <template v-else>
 *   <UpgradePrompt />
 * </template>
 * ```
 */

interface LicenseState {
    valid: boolean
    plan: string | null
    features: string[]
    error: string | null
    expiresAt: string | null
}

// Cache validation results per layer
const licenseCache = new Map<string, LicenseState>()

export const useLicense = (layerId: string) => {
    const config = useRuntimeConfig()

    const isLicensed = ref(false)
    const plan = ref<string | null>(null)
    const features = ref<string[]>([])
    const error = ref<string | null>(null)
    const loading = ref(false)
    const expiresAt = ref<string | null>(null)

    // Check if we have a cached result
    const cached = licenseCache.get(layerId)
    if (cached) {
        isLicensed.value = cached.valid
        plan.value = cached.plan
        features.value = cached.features
        error.value = cached.error
        expiresAt.value = cached.expiresAt
    }

    /**
     * Validate the license key for this layer.
     * Reads key from runtime config or environment.
     */
    const checkLicense = async () => {
        // Skip on server
        if (import.meta.server) return

        // Get license key from config
        const licenseKey = (config.public as any).licenseKey ||
            (config.public as any).nuxtLayersLicense ||
            localStorage?.getItem('nuxtlayers_license')

        if (!licenseKey) {
            error.value = 'No license key configured'
            isLicensed.value = false
            return { valid: false, error: 'No license key' }
        }

        loading.value = true

        try {
            // Get current domain
            const domain = window.location.hostname

            // Validate against API
            const response = await $fetch<{
                valid: boolean
                plan?: string
                features?: string[]
                error?: string
                expiresAt?: string
            }>('/api/license/validate', {
                method: 'POST',
                body: {
                    licenseKey,
                    layerId,
                    domain
                }
            })

            // Update state
            isLicensed.value = response.valid
            plan.value = response.plan || null
            features.value = response.features || []
            error.value = response.error || null
            expiresAt.value = response.expiresAt || null

            // Cache the result
            licenseCache.set(layerId, {
                valid: response.valid,
                plan: response.plan || null,
                features: response.features || [],
                error: response.error || null,
                expiresAt: response.expiresAt || null
            })

            return response

        } catch (err: any) {
            error.value = err.message || 'Failed to validate license'
            isLicensed.value = false
            return { valid: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    /**
     * Check if a specific feature is available.
     */
    const hasFeature = (featureName: string): boolean => {
        return isLicensed.value && features.value.includes(featureName)
    }

    /**
     * Clear cached license state.
     */
    const clearCache = () => {
        licenseCache.delete(layerId)
        isLicensed.value = false
        plan.value = null
        features.value = []
        error.value = null
    }

    return {
        isLicensed: readonly(isLicensed),
        plan: readonly(plan),
        features: readonly(features),
        error: readonly(error),
        loading: readonly(loading),
        expiresAt: readonly(expiresAt),
        checkLicense,
        hasFeature,
        clearCache
    }
}

export default useLicense
