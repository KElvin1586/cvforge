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

**Default price: KSh 1,299** (configurable — see below). Everything in
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

All values live in `src/config/monetization.ts`. The checkout URL defaults
to the real Lemon Squeezy checkout and can be overridden at build time with
environment variables — no code changes needed:

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_PREMIUM_PRICE` | `1299` | One-time price shown in UI |
| `VITE_PREMIUM_CURRENCY` | `KES` | ISO 4217 currency for price formatting |
| `VITE_UPGRADE_URL` | the real Lemon Squeezy checkout | Overrides the default checkout URL |
| `VITE_ENABLE_TEST_MODE` | *(unset)* | Enables the internal test checkout (dev/QA only — never in production) |

The production checkout is:

```
https://kelvindigitaltools.lemonsqueezy.com/checkout/buy/5a9a0680-dbb4-4c1b-b38c-02c8bbd20fe1
```

A plain `npm run build` ships with this URL baked in. To use a different
provider/link, override it:

```bash
VITE_UPGRADE_URL="https://your-real-checkout-url" npm run build
```

## How Premium activation works (Lemon Squeezy)

CVForge does not process payments or store card data — checkout is hosted
by Lemon Squeezy. The full customer flow:

1. A Free user clicks any 🔒 Premium feature (or **Upgrade**).
2. The upgrade modal opens, showing the feature, the Premium benefit list,
   and the price.
3. **Continue to checkout** opens the Lemon Squeezy checkout in a new tab.
4. The customer pays; Lemon Squeezy emails them a **license key**.
5. Back in CVForge, the customer opens **#/activate** (linked from the
   modal and the plan badge) and pastes the key.
6. The app calls Lemon Squeezy's real license API
   (`POST /v1/licenses/activate`), which binds the key to a device
   "instance". Only a genuine, in-limit, non-expired key succeeds.
7. Premium unlocks and the activation is persisted locally
   (`cvforge:license`).

On every subsequent load the app re-validates the stored key+instance
(`POST /v1/licenses/validate`):

- still valid → stays Premium;
- refunded / revoked / disabled / expired → reverts to Free;
- network unreachable → keeps the current plan (offline use stays Premium).

The customer can release a device from **#/activate** via **Deactivate
this device** (`POST /v1/licenses/deactivate`) so the key can be used on
another device.

### Why no serverless endpoint is needed here

Requirement 11 of the original brief asked for a server-side verification
endpoint if the frontend could not verify a purchase securely. Lemon
Squeezy's license endpoints are **public by design** (they require no
secret API key and are served with permissive CORS), so the browser can
call them directly and the verification is genuine — no secret is exposed
and no proxy is required. If you switch to a provider whose verification
API needs a secret key (e.g. Stripe), you would add a small serverless
function to hold that secret; do not put it in a `VITE_*` variable.

### Honest limitation

Verification of the license is real (a fake or guessed key is rejected by
Lemon Squeezy). However, because CVForge is a fully client-side app, the
*enforcement* of the resulting plan runs in the browser. A determined,
technically skilled user could patch local state or the shipped JS to flip
the plan flag. This is inherent to any static, serverless frontend and is
not something this codebase claims to prevent.

## Lemon Squeezy dashboard setup

For the store owner, the required product settings are:

1. **Create the store / product.** In the Lemon Squeezy dashboard, create a
   product named e.g. "CVForge Premium".
2. **One-time price.** Set it to KSh 1,299 (or your price) as a **one-time /
   lifetime** product, not a subscription.
3. **Enable license keys.** Under the product, turn on **License keys** so
   each purchase generates a unique key and emails it to the customer.
4. **Set an activation limit** (e.g. 3 devices) so a single key can't be
   shared unlimited times. Each `activate` call consumes one seat; the app
   exposes **Deactivate** to free a seat.
5. **Copy the checkout link** from the product's **Share** menu. That is
   the URL baked into `src/config/monetization.ts`.
6. **Secrets stay in Lemon Squeezy.** Never copy your Lemon Squeezy API
   key, webhook signing secret, or store secret into the frontend or a
   `VITE_*` variable — they are not needed for license validation.

## Development test mode ≠ real customer payment

The internal test checkout (`#/checkout`) exists **only** to exercise the
Free/Premium gating during development and QA. It flips a local
entitlement flag and processes, simulates, and claims **no** payment. It
is compiled out of production builds entirely (dead-code-eliminated unless
`vite dev` or `VITE_ENABLE_TEST_MODE=true`). Never enable it in a
production build, and never present it to customers as a purchase.

## Upgrade flow summary

1. A Free user clicks any 🔒 Premium feature.
2. The upgrade modal opens (feature, benefits, price).
3. **Continue to checkout** → real Lemon Squeezy checkout (new tab).
4. Customer pays, receives a license key by email.
5. **#/activate** → enter key → verified against Lemon Squeezy → Premium.
6. Premium persists across reload; re-validated on load; deactivate releases the device.

