# Commercial License

CVForge is distributed under the **MIT License** (see
[LICENSE.md](../LICENSE.md)). That license permits commercial use,
modification, and redistribution.

This document clarifies the **commercial terms of the product itself** —
that is, the Free and Premium feature entitlements offered to end users of a
CVForge deployment. It is descriptive, not a legal contract.

## End-user plans

| | Free ($0) | Premium (one-time, default KSh 1,299) |
| --- | --- | --- |
| Full CV editor (all 9 sections) | ✅ | ✅ |
| Print / PDF export | ✅ | ✅ |
| Drag-and-drop section reordering | ✅ | ✅ |
| Dark / light mode | ✅ | ✅ |
| Templates | Classic, Modern | All 5 (adds Elegant, ATS Pro, Bold) |
| Saved CVs | 1 | Unlimited |
| Advanced customization (colors, fonts, size) | — | ✅ |
| Advanced layouts (density controls) | — | ✅ |
| Cover-letter builder | — | ✅ |
| Saved versions (named snapshots) | — | ✅ |
| Import / export (JSON) | — | ✅ |
| ATS formatting tools | — | ✅ |

## Premium license terms (per end user)

- Premium is a **one-time purchase** (no subscription) that unlocks the
  features above on the buyer's device/browser profile.
- The entitlement is stored locally in the buyer's browser
  (`localStorage`); it is not tied to an account and does not transfer
  between devices or browsers.
- No refunds, chargeback handling, or license key system is implemented by
  this codebase; the payment provider connected by the operator governs
  those policies.
- Premium grants usage of the *deployed application's features*. It does not
  grant ownership of the CVForge source code, which remains MIT-licensed.

## Operator notes

- The operator of a deployment is responsible for connecting a real payment
  provider, setting `VITE_UPGRADE_URL`, displaying legally required terms,
  and complying with consumer-protection, tax, and refund regulations in
  their jurisdiction.
- Do not enable test mode (`VITE_ENABLE_TEST_MODE`) on a production
  deployment — it lets anyone flip the local entitlement flag.
