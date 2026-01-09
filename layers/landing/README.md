# @vantol/landing

Landing page layer with hero, features, testimonials, and CTA components.

## Features

- 🎯 Hero section with CTA
- ✨ Features grid
- 💬 Testimonials
- 📣 Call-to-action section

## Installation

```bash
npx nuxt-layers add @vantol/landing
```

## Usage

### Hero

```vue
<LandingHero
  title="Build faster with Nuxt Layers"
  subtitle="Pre-built components for your next project."
  ctaText="Get Started"
  ctaLink="/signup"
  secondaryText="Learn More"
  secondaryLink="/docs"
/>
```

### Features

```vue
<LandingFeatures
  title="Why Choose Us"
  :features="[
    { icon: '🚀', title: 'Fast', description: 'Lightning quick.' },
    { icon: '🔒', title: 'Secure', description: 'Built-in security.' }
  ]"
/>
```

### CTA

```vue
<LandingCTA
  title="Ready to get started?"
  description="Join thousands of developers."
  ctaText="Start Free Trial"
  ctaLink="/signup"
/>
```

## License

MIT
