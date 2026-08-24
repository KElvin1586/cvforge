# Deployment

CVForge is a fully static app — `npm run build` produces a self-contained
`dist/` directory that any static host can serve. There is no server-side
code, no environment secrets, and no database.

## Build

```bash
npm install
npm run build
```

Deploy the contents of `dist/`.

## Static hosts

### Netlify
- Build command: `npm run build`
- Publish directory: `dist`

### Vercel
- Framework preset: **Vite** (build command and output directory are
  auto-detected: `npm run build`, `dist`)

### GitHub Pages
```bash
npm run build
# then publish dist/ with any pages action, e.g.:
npx gh-pages -d dist
```
If deploying under a project subpath (`user.github.io/cvforge/`), set
`base: '/cvforge/'` in `vite.config.ts` first.

### Cloudflare Pages
- Build command: `npm run build`
- Output directory: `dist`

### Any web server (nginx, Apache, Caddy, S3, …)
Copy `dist/` to the web root. Gzip/brotli compression and long cache
lifetimes for `assets/*` (they are content-hashed) are recommended.

## SPA fallback

The app is a single-page bundle with no client-side routes, so serving
`index.html` at the root is sufficient. A catch-all rewrite to
`index.html` is still a safe default on hosts that support it.

## Security headers (optional but recommended)

```
Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
```

`style-src 'unsafe-inline'` is required because templates inline accent-color
styles. The app makes no network requests and stores data only in the
visitor's browser.

## Pre-release checklist

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm test` passes
- [ ] `npm run build` succeeds
- [ ] `upgradeUrl` in `src/config/monetization.ts` points at your real checkout
- [ ] `devUnlockPremium` is `false`
