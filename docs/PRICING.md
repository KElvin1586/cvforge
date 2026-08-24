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
