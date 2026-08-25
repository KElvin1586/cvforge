# Installation

## Requirements

- **Node.js 18+** (Node 20+ recommended) and npm 9+
- A modern browser (Chrome, Edge, Firefox, Safari)

## Setup

```bash
git clone https://github.com/KElvin1586/cvforge.git
cd cvforge
npm install
```

## Run in development

```bash
npm run dev
```

Open http://localhost:5173 — this shows the landing page; click **Open the
app** (or visit `/#/app`) for the editor. Hot module replacement is
enabled. In `vite dev`, the internal test checkout at `/#/checkout` is
available automatically.

## Production build

```bash
npm run build     # type-checks, then bundles to dist/
npm run preview   # serves dist/ at http://localhost:4173
```

## Verification

```bash
npm run typecheck   # TypeScript, no emit
npm run lint        # ESLint flat config
npm test            # Vitest unit tests
```

## Configuration

All monetization settings are centralized in `src/config/monetization.ts`
and overridable at build time via environment variables:

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_PREMIUM_PRICE` | `1299` | One-time price shown in the upgrade modal and pricing pages |
| `VITE_PREMIUM_CURRENCY` | `USD` | ISO 4217 currency for price formatting |
| `VITE_UPGRADE_URL` | *(unset)* | Real checkout URL (Stripe Payment Link, Lemon Squeezy, Paddle, …). When set, upgrade buttons open it in a new tab. |
| `VITE_ENABLE_TEST_MODE` | *(unset)* | `true` enables the internal test checkout page at `/#/checkout` and routes upgrade buttons to it. For development/QA only — **never enable in production**. In `vite dev`, test mode is always on. |

### Behaviour matrix

| upgradeUrl | testMode | Upgrade button behaviour |
| --- | --- | --- |
| set | any | Opens the configured checkout URL in a new tab |
| unset | on | Opens the internal test checkout (`#/checkout`) — no payment processed |
| unset | off | Shows "checkout not yet configured" — sends users nowhere |

CVForge never links to placeholder or documentation domains.

### Enabling real payments later

1. Create a checkout/payment link with your provider (Stripe Payment Link,
   Lemon Squeezy, Paddle, …).
2. Build with `VITE_UPGRADE_URL` set to that link (keep test mode off).
3. After a successful purchase, set the browser key `cvforge:plan` to
   `"premium"` in `localStorage` (e.g. on your success redirect page). The
   app reads this key on load. No other code changes are needed.

### Testing both plans

In development (`npm run dev`) or a build made with
`VITE_ENABLE_TEST_MODE=true`:

1. Open `/#/checkout` (or click any 🔒 Premium feature → Continue to
   checkout).
2. Use **Test Premium entitlement** / **Test Free entitlement** to flip the
   local plan flag instantly.

This never claims a payment occurred, stores no credentials, and makes no
network calls.

## Troubleshooting

- **`npm install` fails on engine versions** — upgrade Node.js to 18+.
- **Blank page after deploy** — make sure your host serves `index.html` for
  unknown paths (SPA fallback) or deploy at the domain root. In-app
  navigation uses hash routes (`#/app`, `#/checkout`), so a plain static
  host works.
- **Data disappeared** — browser storage was cleared; restore from a JSON
  export (Premium) if you have one.
