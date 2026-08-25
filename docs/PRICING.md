# Pricing

CVForge uses a **Free + one-time Premium** model. No subscriptions, no
feature trials, no in-app upsell pressure. The Free plan is a fully usable
product on its own.

## Free — $0

- Full CV editor with all 9 content sections (personal information,
  summary, work experience, education, skills, projects, certifications,
  languages, references)
- 2 professional templates: Classic and Modern
- 1 CV saved locally in the browser (auto-saved)
- Drag-and-drop section reordering and section visibility toggles
- Print and PDF export (via the browser's print dialog)
- Dark / light mode, fully responsive UI

## Premium — one-time payment

**Default price: $9.99 USD** (configurable — see below). Everything in
Free, plus:

- Unlimited saved CVs
- All 5 templates (adds Elegant, ATS Pro, Bold)
- Advanced customization: accent colors, font family, font size
- Advanced layouts: layout density controls
- Cover-letter builder with matching preview
- Saved versions: named snapshots per CV with one-click restore
- Import / export of CVs as JSON files
- ATS formatting tools: structural checks + keyword matching against a job
  description

## Configuring price and checkout

All values live in `src/config/monetization.ts` and can be overridden at
build time with environment variables — no code changes needed:

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_PREMIUM_PRICE` | `9.99` | One-time price shown in UI |
| `VITE_PREMIUM_CURRENCY` | `USD` | ISO 4217 currency for price formatting |
| `VITE_UPGRADE_URL` | *(unset)* | Real checkout URL (Stripe Payment Link, Lemon Squeezy, Paddle, …) |
| `VITE_ENABLE_TEST_MODE` | *(unset)* | Enables the internal test checkout (dev/QA only — never in production) |

Example production build:

```bash
VITE_UPGRADE_URL="https://buy.stripe.com/your-link" \
VITE_PREMIUM_PRICE="9.99" \
VITE_PREMIUM_CURRENCY="USD" \
npm run build
```

If `VITE_UPGRADE_URL` is not set and test mode is disabled, the upgrade
buttons show an honest "checkout not yet configured" notice instead of
sending users anywhere — CVForge never points users at placeholder domains.

## Connecting a real payment provider

CVForge does not process payments itself — the upgrade buttons simply open
the checkout link you configure. To go live:

1. **Create the product** in your chosen payment provider (Stripe, Lemon
   Squeezy, Paddle, Gumroad, …) — e.g. "CVForge Premium" as a one-time
   product at your price.
2. **Create the checkout/payment link** for that product in the provider's
   dashboard.
3. **Set `VITE_UPGRADE_URL` to that URL** — either in a local `.env` file
   (copy [.env.example](../.env.example)) or in your host's environment
   variables:

   ```bash
   VITE_UPGRADE_URL=https://YOUR_REAL_CHECKOUT_URL
   ```

   Use the exact link your provider issued. Do not use `example.com` or any
   other placeholder domain — CVForge intentionally ships with no default
   checkout URL.
4. **Rebuild the application** (`npm run build`). `VITE_*` variables are
   baked into the static bundle at build time; changing them without
   rebuilding has no effect.
5. **Test the checkout**: deploy the rebuilt bundle, click any 🔒 Premium
   feature → **Continue to checkout**, and walk through the provider's
   checkout (use the provider's test mode if available). Confirm the
   upgrade button opens your real link in a new tab.
6. **Keep secrets out of the frontend.** Never put private API keys,
   secret keys, webhook signing secrets, or any payment credentials in
   `VITE_*` variables or anywhere in this codebase — everything prefixed
   with `VITE_` is publicly visible in the shipped JavaScript. Only public
   links and publishable identifiers belong here. Anything secret must
   live only in your provider's dashboard or on a server you operate.

### Development test mode ≠ real customer payment

The internal test checkout (`#/checkout`) exists **only** to exercise the
Free/Premium gating during development and QA. It flips a local
`localStorage` flag and processes, simulates, and claims **no** payment.
It is available only in `vite dev` or builds made with
`VITE_ENABLE_TEST_MODE=true`. Never enable it in a production build, and
never present it to customers as a purchase.

## Upgrade flow

1. A Free user clicks any 🔒 Premium feature.
2. The upgrade modal opens, showing the feature, the Premium benefit list,
   and the configured price.
3. **Continue to checkout** opens the configured checkout URL (new tab for
   external providers; the internal test page in dev/test builds).
4. After a successful purchase, set `localStorage["cvforge:plan"]` to
   `"premium"` on the buyer's device (e.g. on your payment success redirect
   page). The app reads this key on load.

No payment processing, payment simulation, or license validation exists in
this codebase, and none is claimed.
