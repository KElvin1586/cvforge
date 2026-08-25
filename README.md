# CVForge — Professional CV & Resume Builder

CVForge is a production-ready, local-first CV/resume builder built with
**React + TypeScript + Vite + Tailwind CSS**. There is no backend, no
database, and no tracking — all data is stored in your browser's
`localStorage` and never leaves your device.

## Pages

- **`#/` — Landing page:** product overview, features, Free/Premium pricing
  comparison, privacy statement. (The default page.)
- **`#/app` — The app:** full CV editor with live preview, templates,
  styling, cover letters, and ATS tools.
- **`#/checkout` — Internal test checkout:** development/test-builds only;
  flips the local plan flag for QA without any payment.

## Features

### Editor
- Personal information (name, title, email, phone, location, website, LinkedIn, GitHub)
- Professional summary
- Work experience with bullet-point achievements and "current role" support
- Education
- Skills with proficiency levels
- Projects with links and technologies
- Certifications
- Languages with proficiency
- References
- Drag-and-drop (or arrow-button) section reordering
- Per-section show/hide toggles
- Live A4 preview that updates as you type

### Templates & styling
- **Free:** Classic, Modern
- **Premium:** Elegant, ATS Pro, Bold
- Accent colors, font family, font size, and layout density controls (Premium)

### Output
- Print-optimized stylesheet (`@page` A4, print-color-adjust)
- PDF export via the browser's print-to-PDF (reliable on every platform)

### Data
- Auto-save to browser storage on every change
- Import/export CVs as validated JSON files (Premium)
- Multiple saved CVs with rename, duplicate, and delete (Premium: unlimited)
- Named version snapshots per CV with restore (Premium)

### Extras
- Cover-letter builder with matching live preview (Premium)
- ATS checker: 9 structural readiness checks plus keyword matching against a
  pasted job description (Premium)
- Dark / light mode (follows system preference by default)
- Responsive layout with a mobile edit/preview toggle
- Accessible: labeled controls, keyboard-focusable modal with `Esc` support,
  ARIA attributes on interactive elements

## Plans

| | Free ($0) | Premium (one-time, default KSh 1,299) |
| --- | --- | --- |
| CV editor, all sections | ✅ | ✅ |
| Templates | Classic + Modern | All 5 |
| Saved CVs | 1 | Unlimited |
| Print / PDF | ✅ | ✅ |
| Advanced customization & layouts | — | ✅ |
| Cover-letter builder | — | ✅ |
| Saved versions | — | ✅ |
| Import / export JSON | — | ✅ |
| ATS formatting tools | — | ✅ |

Premium gating is centralized in `src/lib/entitlements.ts`. Locked actions
open an upgrade modal instead of executing. The upgrade flow routes to a
**configurable checkout URL** (`VITE_UPGRADE_URL`), or — in development/test
builds — to an internal test checkout page. There are **no fake payments,
no license keys, and no placeholder links**. See
[docs/PRICING.md](docs/PRICING.md) and
[docs/COMMERCIAL-LICENSE.md](docs/COMMERCIAL-LICENSE.md).

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173. See [docs/INSTALLATION.md](docs/INSTALLATION.md)
for details and [docs/USER-GUIDE.md](docs/USER-GUIDE.md) for a full
walkthrough.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | TypeScript check only |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests (entitlements, model, storage, ATS, monetization, routing) |

## Project structure

```
src/
  config/monetization.ts     # price, currency, upgrade URL, test mode
  lib/
    entitlements.ts          # plan/feature matrix — single source of truth
    router.ts                # tiny hash router (landing / app / checkout)
    storage.ts               # localStorage persistence
    importExport.ts          # JSON export + validating importer
    ats.ts                   # ATS checks & keyword analysis
  state/
    AppContext.tsx           # CVs, plan, theme, versions (reducer)
    UpgradeContext.tsx       # requireFeature() gating + upgrade modal
  pages/
    LandingPage.tsx          # marketing page with pricing comparison
    TestCheckoutPage.tsx     # dev/test-only entitlement switcher
  components/
    editor/                  # forms for every CV section, style panel
    preview/                 # A4 page wrapper + 5 templates
    CvToolbar.tsx            # CV management, versions, import/export
    CoverLetterEditor.tsx    # premium cover-letter builder
    AtsPanel.tsx             # premium ATS tools
    UpgradeModal.tsx         # paywall modal
  test/                      # vitest suites
docs/                        # user guide, installation, deployment,
                             # pricing, commercial license
public/favicon.svg           # app icon
```

## Security & privacy

- No secrets, API keys, or credentials anywhere in the codebase
- No network calls at runtime; CV data stays in browser storage
- Imported JSON is strictly validated and sanitized before use
- No `dangerouslySetInnerHTML`; all user content is rendered as text

## License

MIT — see [LICENSE.md](LICENSE.md).
