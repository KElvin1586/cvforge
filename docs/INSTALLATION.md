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

Open http://localhost:5173. Hot module replacement is enabled.

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

All monetization settings live in `src/config/monetization.ts`:

| Setting | Default | Description |
| --- | --- | --- |
| `premiumPrice` | `9.99` | One-time price shown in the upgrade modal |
| `currency` | `'USD'` | ISO currency for price formatting |
| `upgradeUrl` | `https://example.com/cvforge/upgrade` | Checkout URL opened by "Continue to checkout" |
| `devUnlockPremium` | `false` | Demo switch: shows an "Activate Premium (demo)" button in the upgrade modal. Also enabled by building with `VITE_DEV_UNLOCK_PREMIUM=true`. Keep `false` in production. |

### Enabling real payments later

1. Create a checkout/payment link with your provider (Stripe Payment Link,
   Lemon Squeezy, Paddle, …).
2. Set `upgradeUrl` to that link.
3. After a successful purchase, set the browser key `cvforge:plan` to
   `"premium"` in `localStorage` (e.g. on your success redirect page). The
   app reads this key on load. No other code changes are needed.

## Troubleshooting

- **`npm install` fails on engine versions** — upgrade Node.js to 18+.
- **Blank page after deploy** — make sure your host serves `index.html` for
  unknown paths (SPA fallback) or deploy at the domain root.
- **Data disappeared** — browser storage was cleared; restore from a JSON
  export (Premium) if you have one.
