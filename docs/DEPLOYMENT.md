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
VITE_PREMIUM_PRICE="1299" \
VITE_PREMIUM_CURRENCY="KES" \
npm run build
```

Deploy the contents of `dist/`.

> Do **not** set `VITE_ENABLE_TEST_MODE` for production builds — it enables
> the internal test checkout, which lets any visitor grant themselves
> Premium locally.

## Configuring the real checkout URL

`VITE_UPGRADE_URL` is the only intentionally unshipped value: the
repository contains no default checkout link by design. Before a
production release:

1. Create the product (e.g. "CVForge Premium", one-time price) in your
   chosen payment provider's dashboard.
2. Create the checkout/payment link for that product.
3. Set `VITE_UPGRADE_URL` to the exact link your provider issued — in your
   host's environment variables or a local `.env` (see
   [.env.example](../.env.example)):

   ```bash
   VITE_UPGRADE_URL=https://YOUR_REAL_CHECKOUT_URL
   ```

   Never use `example.com` or another placeholder domain. If the variable
   is unset, the app shows "checkout not yet configured" instead of
   sending users anywhere.
4. Rebuild (`npm run build`) — `VITE_*` values are baked into the static
   bundle at build time.
5. Test the checkout end-to-end on the deployed site: open the upgrade
   modal and confirm **Continue to checkout** opens your real link in a
   new tab, then walk through the provider's own test mode if available.
6. Never put private API keys, secret keys, webhook signing secrets, or
   any payment credentials in `VITE_*` variables or anywhere in this
   repository — everything in the frontend bundle is public. Secrets
   belong only in your provider's dashboard or a server you operate.

The development/test Premium mode (`#/checkout`, enabled by `vite dev` or
`VITE_ENABLE_TEST_MODE=true`) is a QA convenience that flips a local
entitlement flag — it is **not** a real customer payment and must never be
enabled in a production build.

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
