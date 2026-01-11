<script setup lang="ts">
/**
 * Onboarding Wizard - Multi-step setup flow
 */

definePageMeta({
  layout: 'saas'
})

useHead({ title: 'Get Started - My SaaS App' })

const { user } = useFirebaseAuth()
const teamStore = useSaasTeam()
const router = useRouter()

const currentStep = ref(1)
const totalSteps = 4

// Form data
const form = reactive({
  teamName: '',
  teamSlug: '',
  inviteEmails: '',
  plan: 'pro'
})

const loading = ref(false)

// Auto-generate slug
watch(() => form.teamName, (name) => {
  form.teamSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
})

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleComplete = async () => {
  loading.value = true
  try {
    // Create team
    await teamStore.createTeam({
      name: form.teamName,
      slug: form.teamSlug
    })

    // Invite members if provided
    if (form.inviteEmails) {
      const emails = form.inviteEmails.split(',').map(e => e.trim()).filter(Boolean)
      for (const email of emails) {
        await teamStore.inviteMember(email, 'member')
      }
    }

    // Redirect to dashboard or checkout
    if (form.plan !== 'free') {
      await router.push(`/checkout?plan=${form.plan}`)
    } else {
      await router.push('/app')
    }
  } catch (e) {
    console.error('Onboarding error:', e)
  } finally {
    loading.value = false
  }
}

const steps = [
  { number: 1, title: 'Create Team', icon: 'building' },
  { number: 2, title: 'Invite Members', icon: 'users' },
  { number: 3, title: 'Choose Plan', icon: 'credit-card' },
  { number: 4, title: 'Get Started', icon: 'rocket' }
]
</script>

<template>
  <div class="onboarding">
    <!-- Progress -->
    <div class="onboarding-progress">
      <div 
        v-for="step in steps" 
        :key="step.number"
        class="onboarding-step"
        :class="{ 
          active: currentStep === step.number,
          completed: currentStep > step.number
        }"
      >
        <div class="onboarding-step-circle">
          <svg v-if="currentStep > step.number" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span v-else>{{ step.number }}</span>
        </div>
        <span class="onboarding-step-title">{{ step.title }}</span>
      </div>
    </div>

    <!-- Content -->
    <div class="onboarding-content">
      <!-- Step 1: Create Team -->
      <div v-if="currentStep === 1" class="onboarding-card">
        <div class="onboarding-header">
          <h1 class="onboarding-title">Create Your Team</h1>
          <p class="onboarding-desc">Set up your organization to get started</p>
        </div>

        <div class="onboarding-form">
          <div class="onboarding-field">
            <label class="onboarding-label">Team Name</label>
            <input 
              v-model="form.teamName"
              type="text"
              class="onboarding-input"
              placeholder="Acme Inc"
            />
          </div>
          <div class="onboarding-field">
            <label class="onboarding-label">Team URL</label>
            <div class="onboarding-input-group">
              <span class="onboarding-input-prefix">app.example.com/</span>
              <input 
                v-model="form.teamSlug"
                type="text"
                class="onboarding-input"
                placeholder="acme"
              />
            </div>
          </div>
        </div>

        <div class="onboarding-actions">
          <button 
            class="onboarding-btn-primary" 
            :disabled="!form.teamName"
            @click="nextStep"
          >
            Continue
          </button>
        </div>
      </div>

      <!-- Step 2: Invite Members -->
      <div v-if="currentStep === 2" class="onboarding-card">
        <div class="onboarding-header">
          <h1 class="onboarding-title">Invite Your Team</h1>
          <p class="onboarding-desc">Add colleagues to collaborate with</p>
        </div>

        <div class="onboarding-form">
          <div class="onboarding-field">
            <label class="onboarding-label">Email Addresses</label>
            <textarea 
              v-model="form.inviteEmails"
              class="onboarding-textarea"
              placeholder="john@example.com, jane@example.com"
              rows="4"
            />
            <p class="onboarding-hint">Separate multiple emails with commas</p>
          </div>
        </div>

        <div class="onboarding-actions">
          <button class="onboarding-btn-secondary" @click="prevStep">Back</button>
          <button class="onboarding-btn-primary" @click="nextStep">
            {{ form.inviteEmails ? 'Continue' : 'Skip for now' }}
          </button>
        </div>
      </div>

      <!-- Step 3: Choose Plan -->
      <div v-if="currentStep === 3" class="onboarding-card onboarding-card-wide">
        <div class="onboarding-header">
          <h1 class="onboarding-title">Choose Your Plan</h1>
          <p class="onboarding-desc">Start with a 14-day free trial of any paid plan</p>
        </div>

        <div class="onboarding-plans">
          <label 
            class="onboarding-plan"
            :class="{ selected: form.plan === 'free' }"
          >
            <input type="radio" v-model="form.plan" value="free" />
            <div class="onboarding-plan-content">
              <div class="onboarding-plan-name">Free</div>
              <div class="onboarding-plan-price">$0<span>/month</span></div>
              <p class="onboarding-plan-desc">Basic features for personal use</p>
            </div>
          </label>

          <label 
            class="onboarding-plan"
            :class="{ selected: form.plan === 'pro' }"
          >
            <input type="radio" v-model="form.plan" value="pro" />
            <div class="onboarding-plan-content">
              <div class="onboarding-plan-badge">Popular</div>
              <div class="onboarding-plan-name">Pro</div>
              <div class="onboarding-plan-price">$29<span>/month</span></div>
              <p class="onboarding-plan-desc">For professional developers</p>
            </div>
          </label>

          <label 
            class="onboarding-plan"
            :class="{ selected: form.plan === 'team' }"
          >
            <input type="radio" v-model="form.plan" value="team" />
            <div class="onboarding-plan-content">
              <div class="onboarding-plan-name">Team</div>
              <div class="onboarding-plan-price">$99<span>/month</span></div>
              <p class="onboarding-plan-desc">For growing teams</p>
            </div>
          </label>
        </div>

        <div class="onboarding-actions">
          <button class="onboarding-btn-secondary" @click="prevStep">Back</button>
          <button class="onboarding-btn-primary" @click="nextStep">Continue</button>
        </div>
      </div>

      <!-- Step 4: Get Started -->
      <div v-if="currentStep === 4" class="onboarding-card">
        <div class="onboarding-header">
          <div class="onboarding-success-icon">🎉</div>
          <h1 class="onboarding-title">You're All Set!</h1>
          <p class="onboarding-desc">Your team "{{ form.teamName }}" is ready to go</p>
        </div>

        <div class="onboarding-summary">
          <div class="onboarding-summary-item">
            <span class="onboarding-summary-label">Team</span>
            <span class="onboarding-summary-value">{{ form.teamName }}</span>
          </div>
          <div class="onboarding-summary-item">
            <span class="onboarding-summary-label">Plan</span>
            <span class="onboarding-summary-value">{{ form.plan.charAt(0).toUpperCase() + form.plan.slice(1) }}</span>
          </div>
          <div v-if="form.inviteEmails" class="onboarding-summary-item">
            <span class="onboarding-summary-label">Invites</span>
            <span class="onboarding-summary-value">{{ form.inviteEmails.split(',').length }} members</span>
          </div>
        </div>

        <div class="onboarding-actions">
          <button class="onboarding-btn-secondary" @click="prevStep">Back</button>
          <button 
            class="onboarding-btn-primary"
            :disabled="loading"
            @click="handleComplete"
          >
            {{ loading ? 'Setting up...' : (form.plan !== 'free' ? 'Continue to Billing' : 'Go to Dashboard') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.onboarding {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 0;
}

.onboarding-progress {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 2.5rem;
}

.onboarding-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.onboarding-step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #888;
  transition: all 0.3s;
}

.onboarding-step.active .onboarding-step-circle {
  background: #F97316;
  border-color: #F97316;
  color: #000;
}

.onboarding-step.completed .onboarding-step-circle {
  background: #22c55e;
  border-color: #22c55e;
  color: #fff;
}

.onboarding-step-title {
  font-size: 0.75rem;
  color: #666;
  transition: color 0.3s;
}

.onboarding-step.active .onboarding-step-title,
.onboarding-step.completed .onboarding-step-title {
  color: #fff;
}

.onboarding-content {
  display: flex;
  justify-content: center;
}

.onboarding-card {
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
}

.onboarding-card-wide {
  max-width: 700px;
}

.onboarding-header {
  text-align: center;
  margin-bottom: 2rem;
}

.onboarding-success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.onboarding-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
}

.onboarding-desc {
  color: #888;
  font-size: 0.9rem;
}

.onboarding-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.onboarding-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.onboarding-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #ccc;
}

.onboarding-input,
.onboarding-textarea {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: #fff;
  transition: all 0.2s;
}

.onboarding-input:focus,
.onboarding-textarea:focus {
  outline: none;
  border-color: #F97316;
}

.onboarding-textarea {
  resize: none;
}

.onboarding-input-group {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.onboarding-input-group:focus-within {
  border-color: #F97316;
}

.onboarding-input-prefix {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  color: #888;
  font-size: 0.9rem;
  white-space: nowrap;
}

.onboarding-input-group .onboarding-input {
  border: none;
  border-radius: 0;
  background: transparent;
}

.onboarding-hint {
  font-size: 0.75rem;
  color: #666;
}

.onboarding-plans {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

@media (max-width: 640px) {
  .onboarding-plans {
    grid-template-columns: 1fr;
  }
}

.onboarding-plan {
  position: relative;
  cursor: pointer;
}

.onboarding-plan input {
  position: absolute;
  opacity: 0;
}

.onboarding-plan-content {
  background: rgba(255, 255, 255, 0.02);
  border: 2px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
  transition: all 0.2s;
}

.onboarding-plan.selected .onboarding-plan-content {
  border-color: #F97316;
  background: rgba(249, 115, 22, 0.05);
}

.onboarding-plan-badge {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: #F97316;
  color: #000;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
}

.onboarding-plan-name {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.25rem;
}

.onboarding-plan-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.25rem;
}

.onboarding-plan-price span {
  font-size: 0.875rem;
  font-weight: 400;
  color: #888;
}

.onboarding-plan-desc {
  font-size: 0.75rem;
  color: #888;
}

.onboarding-summary {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.onboarding-summary-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.onboarding-summary-label {
  color: #888;
}

.onboarding-summary-value {
  color: #fff;
  font-weight: 500;
}

.onboarding-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
}

.onboarding-btn-secondary {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ccc;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.onboarding-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.onboarding-btn-primary {
  background: #F97316;
  border: none;
  color: #000;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.onboarding-btn-primary:hover {
  background: #ea580c;
}

.onboarding-btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
