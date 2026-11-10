# Tiny Apps repo: instructions for Copilot

This repo is a hub plus a collection of tiny offline web apps (PWAs), hosted on GitHub Pages.
No build step, no frameworks, no npm. Plain HTML, CSS and JavaScript only.

## Layout

```
index.html              HUB. The landing page, and itself an installable PWA.
sw.js                   Hub service worker.
manifest.webmanifest    Hub manifest ("Tiny Apps").
icon.png                Hub icon.
.github/copilot-instructions.md   This file.
<app>/                  One folder per tiny app (example: loan/)
  index.html            The whole app in ONE file (HTML + CSS + JS inline).
  sw.js                 This app's own service worker.
  manifest.webmanifest  Name, colors and icon, so it can also be installed on its own.
  icon.png              App icon.
```

## How the hub works

- The hub lists every app from the `APPS` array at the top of the script in the root `index.html`.
- The hub can be added to the home screen. Its scope is the whole site, so tapping an app opens it inside the hub.
- Every app can also be installed on its own from its own folder.
- Stay up to date: on load (and with the "Check for updates" button) the hub re-downloads
  its own files and every app's `files` list (bypassing the HTTP cache) into the shared cache,
  so all apps work offline and stay current without opening each one.
- Every service worker in this repo uses the SAME cache name: `tiny-apps`. Do not change it,
  and do not create per-app cache names. Workers are network first, falling back to the cache offline.

## Rules

- Every app lives in its own folder. Never mix one app's files into another's folder or the root.
- Each app is self-contained: one `index.html` with inline CSS and JS. Use relative paths only.
- Each app registers its own `sw.js` with `scope: './'` from its own folder.
- Data is stored on the device (localStorage or IndexedDB). No servers, no accounts, no tracking.
- Use a unique storage key per app (example: `loanTracker.v1`) because all apps share one origin.
- Every app has a "← Back to Tiny Apps" button at the very bottom (a link to `../`) that asks the user
  to confirm with a pop-up (`confirm()`) before leaving, and warns if there is unsaved input. Copy it from `loan/index.html` (`#homeLink`).
- Mobile first. Simple, readable, light and dark mode. Keep files small.
- Icons: Existing icons are final. Never regenerate, redraw or recolor `icon.png` files. They already use the brand colors. Only add a new icon when creating a new app, and only if the user provides or asks for one.

## Adding a new app

1. Create `<app>/` with `index.html`, `sw.js`, `manifest.webmanifest` and `icon.png`.
   Copy `loan/sw.js` and `loan/manifest.webmanifest` and change the name, `start_url` stays `./`.
2. Add one entry to `APPS` in the root `index.html`:
   `{ name: 'Name', file: '<app>/', desc: 'One line', files: ['<app>/', '<app>/index.html', '<app>/manifest.webmanifest', '<app>/icon.png'] }`
   The `files` list must name every file the app needs offline. The hub tile always shows that app folder's own `icon.png`, so there is no icon setting.
3. Do not edit other apps while adding a new one.

## Current apps

- `loan/` Loan Tracker. Paste loan account text. It saves snapshots, shows what changed, keeps a
  de-duplicated payment log (the same date, account and amount is never logged twice), and has a
  link to the lender site. It understands four pasted screens: the main account page (with Upcoming and
  Recent payments), Additional Payment Details, Recurring Autopay Scheduled, and All Payments. The parser
  is the `parseText` function between the `/*PARSER*/` markers. A "View all payments" button shows the
  full log grouped by month.
  Each paste is saved as a timestamped snapshot, and the current status is all snapshots layered
  oldest to newest (`mergedState`): newer values win on conflicts, and anything a newer paste leaves
  out (or shows as `-`) is kept from earlier pastes. Never let a partial paste erase data.
  The "days until/past due" count is calculated live (`daysNow`) from the most recently pasted of
  Days Past Due (moved forward by the days since that paste) or Current Due Date, so it changes daily.
