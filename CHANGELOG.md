# Changelog

All notable changes to CVForge are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
  and ATS analysis (Vitest, 17 tests).
- Documentation: README, user guide, installation, deployment, license,
  changelog.
