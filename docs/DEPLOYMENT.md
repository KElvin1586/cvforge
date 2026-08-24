# Deployment

CVForge is a fully static app — `npm run build` produces a self-contained
`dist/` directory that any static host can serve. There is no server-side
code, no environment secrets, and no database. Routing is hash-based
(`#/`, `#/app`, `#/checkout`), so no rewrite rules are required.

## Build

```bash
npm install

# Production build with your real checkout configuration:
VITE_UPGRADE_URL="https://your-provider.com/checkout-link" \
VITE_PREMIUM_PRICE="9.99" \
VITE_PREMIUM_CURRENCY="USD" \
npm run build
```

Deploy the contents of `dist/`.

> Do **not** set `VITE_ENABLE_TEST_MODE` for production builds — it enables
> the internal test checkout, which lets any visitor grant themselves
> Premium locally.

## Static hosts

### Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- Set the `VITE_*` variables under Site settings → Environment variables

### Vercel
- Framework preset: **Vite** (build command and output directory are
  auto-detected: `npm run build`, `dist`)
- Set the `VITE_*` variables in Project → Settings → Environment Variables

### GitHub Pages
```bash
npm run build
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

The app has no client-side routes beyond hash fragments, so serving
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
- [ ] `VITE_UPGRADE_URL` points at your real checkout
- [ ] `VITE_ENABLE_TEST_MODE` is **not** set
- [ ] `npm run preview` smoke-test: landing page, `#/app` editor, free
      gating modal, print/PDF
