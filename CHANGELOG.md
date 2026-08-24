# Changelog

All notable changes to CVForge are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.1.0] - 2026-08-24

### Added
- Public landing page (`#/`) with product overview, feature grid,
  Free/Premium pricing comparison, privacy statement, and CTAs.
- Hash-based routing (`#/`, `#/app`, `#/checkout`) with per-route document
  titles.
- Internal development/test checkout page (`#/checkout`) — available only in
  `vite dev` or builds with `VITE_ENABLE_TEST_MODE=true`; flips the local
  entitlement flag for QA without processing, simulating, or claiming any
  payment.
- SEO: Open Graph and Twitter metadata, robots directive, theme-color, and
  an SVG favicon.
- `PLAN_LABELS` in the entitlement module; pricing/landing UIs derive plan
  names and benefits from the centralized matrix.
- Unit tests for monetization configuration and hash routing (24 tests
  total).

### Changed
- Upgrade URL, price, and currency are now env-configurable
  (`VITE_UPGRADE_URL`, `VITE_PREMIUM_PRICE`, `VITE_PREMIUM_CURRENCY`) with
  safe fallbacks; `resolveUpgradeHref()` is the single decision point for
  the upgrade destination.
- The upgrade modal now follows one unified flow (modal → configured
  checkout URL / internal test page) instead of a modal-embedded demo
  switch.
- In-app header logo links back to the landing page.

### Removed
- **All placeholder links**: the upgrade button no longer points at
  example.com. When no checkout URL is configured and test mode is off, the
  UI shows an honest "checkout not yet configured" notice instead of
  sending users anywhere.
- example.com addresses from the sample CV content.
- Dead `PremiumButton` component.

### Fixed
- `LICENSE` renamed to `LICENSE.md` to match the documentation set.

## [1.0.0] - 2026-08-24

### Added
- Full CV editor: personal information, professional summary, work
  experience, education, skills, projects, certifications, languages, and
  references.
- Live A4 preview with five templates: Classic and Modern (free), Elegant,
  ATS Pro, and Bold (premium).
- Drag-and-drop section reordering with arrow-button fallback, plus
  per-section visibility toggles.
- Print-optimized output and PDF export via the browser print dialog.
- Local-first persistence (localStorage) with auto-save on every change.
- Freemium entitlement system with a centralized plan/feature matrix and an
  upgrade modal; configurable one-time price (default $9.99) and checkout
  URL. No fake payments or license validation.
- Premium features: unlimited CVs, all templates, advanced customization
  (accent color, font family, size), layout density, cover-letter builder,
  named version snapshots, JSON import/export, and ATS tools (structural
  checks + job-description keyword matching).
- Dark/light mode with system-preference default.
- Responsive layout with mobile edit/preview toggle.
- Accessibility: ARIA labeling, keyboard-dismissable modal, focus states.
- Unit tests covering entitlements, CV model, storage, import validation,
  and ATS analysis (Vitest).
- Documentation: README, user guide, installation, deployment, license,
  changelog.
