# CVForge User Guide

## Getting started

CVForge opens on a landing page with the product overview and pricing.
Click **Open the app** (or visit `/#/app`) to start building. When you open
the app for the first time, a sample CV ("Alex Carter") is loaded so you can
see every feature in action. Everything you type is saved automatically to
your browser — there is no save button and no account.

## The workspace

- **Toolbar (top):** switch between CVs, rename the active CV, create a new
  or sample CV, duplicate, delete, import/export JSON, and manage saved
  versions.
- **Tabs:** CV Editor, Cover Letter (Premium), ATS Check (Premium).
- **Left panel:** styling (template, accent color, font, size, density) and
  collapsible form sections for all CV content.
- **Right panel:** a live, full-size A4 preview of your CV.
- **On mobile:** use the *Edit / Preview* toggle at the top of the editor.

## Editing your CV

1. Open **Personal Information** and fill in your details. Only non-empty
   contact fields appear on the CV.
2. Expand any section — Summary, Work Experience, Education, Skills,
   Projects, Certifications, Languages, References — and add entries with the
   dashed **+ Add** buttons.
3. Each line of a description textarea becomes a bullet point on the CV.
4. Reorder entries with the ↑ ↓ buttons or delete them with ✕.
5. Reorder whole sections by dragging the ⠿ handle (or with ↑ ↓), and hide a
   section entirely with the 👁 toggle — hidden sections keep their data but
   don't appear on the CV.

## Templates and styling

Pick a template in the left panel. **Classic** and **Modern** are free;
Elegant, ATS Pro, and Bold are Premium. Free users keep the default styling;
Premium unlocks accent colors, serif/sans fonts, three text sizes, and three
layout densities.

## Printing and PDF export

Click **🖨 Print / PDF** in the header. Your browser's print dialog opens
with a clean, app-chrome-free A4 page. Choose "Save as PDF" as the
destination to export a PDF. This works the same way for cover letters.

Tips: enable "Background graphics" in the print dialog for the Modern and
Bold templates, and keep margins at "Default" (the app sets A4 margins via
`@page`).

## Managing multiple CVs (Premium)

Free plans include one saved CV. Premium removes the limit:

- **New CV** starts a blank document; **Sample CV** adds a filled example.
- **Duplicate** clones the active CV.
- Rename by editing the name field next to the CV selector.
- **Delete** removes the active CV after confirmation.

## Versions (Premium)

Click **Versions** to snapshot the active CV under a label (e.g. "For
Google"). Restore any snapshot later, or delete ones you no longer need.
Snapshots are stored locally alongside your CVs.

## Import / export (Premium)

- **Export** downloads the active CV as a `cvforge-<name>.json` file.
- **Import** accepts a CVForge JSON export, validates it, and adds it as a
  new CV. Invalid files are rejected with an error message.

## Cover letter (Premium)

Open the **Cover Letter** tab. Fill in the recipient, company, position, and
date, then write the letter body — blank lines separate paragraphs. The
preview uses your CV's name and contact details automatically, and printing
this tab prints the letter.

## ATS check (Premium)

Open the **ATS Check** tab:

1. Review the structural checks (contact info, dates, skills count, length,
   etc.). Warnings include concrete hints.
2. Paste a job description into the textarea to see a keyword-match
   percentage, matched keywords, and missing keywords you may want to weave
   in where truthful.
3. For maximum parser compatibility, switch to the **ATS Pro** template
   (plain, single-column, standard headings).

## Dark mode

Click 🌙 / ☀️ in the header. Your choice is remembered; the default follows
your operating system's preference.

## Upgrading to Premium

Click any 🔒 Premium feature (or the **Upgrade** button in the header) to
open the upgrade modal, which lists everything Premium includes and the
one-time price. **Continue to checkout** opens the checkout link configured
by the site owner. No payment is processed inside CVForge itself.

### Trying Premium in a development build

On development/test builds (`npm run dev`, or a build made with
`VITE_ENABLE_TEST_MODE=true`), the upgrade flow opens an internal test
checkout page (`/#/checkout`) instead. It is clearly labelled as a
development tool: it flips the plan flag stored in your browser between
Free and Premium so you can test both experiences. It processes, simulates,
and claims **no** payment. Production builds have this page disabled.

## Privacy

CVForge never sends your data anywhere. Clearing your browser's site data
permanently deletes your CVs — use **Export** to keep backups.
