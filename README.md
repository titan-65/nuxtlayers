# NuxtLayers

A marketplace for Nuxt Layers — discover, preview, and install pre-built layers via CLI.

## Structure

```
nuxtlayers/
├── apps/
│   ├── web/          # Marketing + marketplace site
│   ├── docs/         # Documentation
│   └── api/          # Registry API
├── packages/
│   ├── cli/          # nuxt-layers CLI
│   ├── sdk/          # Shared types + utilities
│   └── ui/           # Shared UI components
├── layers/           # Official layers
│   ├── auth/
│   ├── blog/
│   ├── admin/
│   ├── payments/
│   └── landing/
└── package.json
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build all packages
pnpm build
```

## License

MIT
