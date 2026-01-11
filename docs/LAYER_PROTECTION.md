# Layer Protection System

This document explains how premium layers are protected from unauthorized access while remaining discoverable in the public repository.

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        PUBLIC REPOSITORY                         │
├──────────────────────────────────────────────────────────────────┤
│  layers/                                                         │
│  ├── auth-firebase/  (FREE - full source code)                  │
│  ├── blog/           (FREE - full source code)                  │
│  ├── admin/          (FREE - full source code)                  │
│  ├── landing/        (FREE - full source code)                  │
│  │                                                               │
│  ├── saas-kit/       (PREMIUM - stub only)                      │
│  │   ├── layer.json  (metadata for discoverability)             │
│  │   ├── README.md   (installation instructions)                │
│  │   └── nuxt.config.ts (stub with "license required" message)  │
│  │                                                               │
│  ├── analytics/      (PREMIUM - stub only)                      │
│  └── payments/       (PREMIUM - stub only)                      │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    FIREBASE STORAGE (Private)                     │
├──────────────────────────────────────────────────────────────────┤
│  layers/                                                         │
│  ├── vantol-saas-kit-1.0.0.tgz    (PRIVATE - signed URL only)   │
│  ├── vantol-analytics-1.0.0.tgz   (PRIVATE - signed URL only)   │
│  └── vantol-payments-1.0.0.tgz    (PRIVATE - signed URL only)   │
└──────────────────────────────────────────────────────────────────┘
```

## How It Works

### Free Layers
1. Full source code is in the public repository
2. Tarball is uploaded to Firebase Storage and made **public**
3. Anyone can download via direct URL or CLI

### Premium Layers
1. Only **stubs** are in the public repository (layer.json, README, placeholder config)
2. Full source code is stored **privately** in Firebase Storage
3. Downloading requires a valid license key
4. API generates time-limited **signed URLs** for authenticated downloads

## Implementation Details

### 1. Download API (`/api/layers/[id]/download.post.ts`)

```typescript
// For PREMIUM layers:
// 1. Validate license key from request body
// 2. Check license is active and not expired
// 3. Verify license covers the requested layer
// 4. Generate signed URL (expires in 1 hour)
// 5. Return signed URL to client
```

### 2. Upload Script (`scripts/upload-layers.mjs`)

```javascript
// Premium layers:
// - Uploaded to Firebase Storage
// - NOT made public (no makePublic() call)
// - Only accessible via signed URLs

// Free layers:
// - Uploaded to Firebase Storage
// - Made public for direct access
```

### 3. CLI Integration (`packages/cli/src/utils/registry.ts`)

```typescript
// 1. CLI calls requestDownload() with license key
// 2. API validates and returns signed URL
// 3. CLI downloads from signed URL
// 4. Extracts to local project
```

## Setting Up

### Environment Variables

```env
# For CLI users
NUXTLAYERS_LICENSE=your-license-key

# For the server
FIREBASE_SERVICE_ACCOUNT=...  # Service account for signed URL generation
```

### For New Premium Layers

1. **Create the full layer** in `layers/<layer-id>/`
2. **Add to LAYERS array** in `scripts/upload-layers.mjs` with `premium: true`
3. **Run upload script**: `node scripts/upload-layers.mjs`
4. **Create stub**: `node scripts/create-stubs.mjs`
5. **Replace source with stub**: Move full source to backup, replace with stub

### For New Free Layers

1. **Create the layer** in `layers/<layer-id>/`
2. **Add to LAYERS array** in `scripts/upload-layers.mjs` with `premium: false`
3. **Run upload script**: `node scripts/upload-layers.mjs`
4. **Commit to public repo** - full source stays in place

## Security Considerations

1. **Signed URLs expire** after 1 hour, preventing long-term sharing
2. **License usage is logged** for audit and abuse detection
3. **License validation** checks status, expiration, and layer coverage
4. **Premium tarballs never made public** in Firebase Storage
5. **Service account key** never exposed to clients

## Testing Locally

1. Run the Nuxt dev server: `pnpm dev`
2. In another terminal, use the CLI: `npx nuxt-layers add @vantol/saas-kit --license TEST_KEY`
3. The API will validate the key and return a signed URL

## Troubleshooting

### "License key required for premium layers"
→ Pass `--license YOUR_KEY` or set `NUXTLAYERS_LICENSE` env var

### "Invalid license key"
→ Check license key is correct and exists in Firestore

### "License does not cover this layer"  
→ License must explicitly include the layer or use `*` for all layers

### "License has expired"
→ Renew subscription at nuxtlayers.dev/pricing
