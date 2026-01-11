# NuxtLayers

A registry and CLI for discovering, installing, and publishing Nuxt Layers.

## Project Structure

```
nuxtlayers/
├── apps/
│   └── web/              # Nuxt web application (registry site)
├── packages/
│   └── cli/              # nuxt-layers CLI tool
├── layers/               # Official layers source code
└── scripts/              # Build and deployment scripts
```

## Development

```bash
# Install dependencies
npm install

# Run web app locally
cd apps/web && npm run dev

# Build CLI
cd packages/cli && npm run build
```

## Deployment

### Prerequisites

1. **npm Account** - For publishing the CLI
2. **Vercel Account** - For deploying the web app
3. **Firebase Project** - For database and storage
4. **Stripe Account** - For payments (optional)

### GitHub Secrets Required

Add these secrets to your GitHub repository:

| Secret | Description |
|--------|-------------|
| `NPM_TOKEN` | npm access token with publish permissions |
| `VERCEL_TOKEN` | Vercel access token |
| `VERCEL_ORG_ID` | Your Vercel organization ID |
| `VERCEL_PROJECT_ID` | Your Vercel project ID |

### Deploy Web App to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Link project: `vercel link`
3. Set environment variables in Vercel dashboard (see `.env.example`)
4. Push to `main` branch (auto-deploys) or run: `vercel --prod`

### Publish CLI to npm

1. Ensure you're logged in: `npm login`
2. Build the CLI: `cd packages/cli && npm run build`
3. Publish: `npm publish --access public`

Or trigger the GitHub Action manually from the Actions tab.

## CLI Usage

```bash
# Install a layer
npx nuxt-layers add @vantol/auth-firebase

# Search layers
npx nuxt-layers search auth

# List installed layers
npx nuxt-layers list
```

## License

MIT
