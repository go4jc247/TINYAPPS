# Tiny Apps repo: instructions for Copilot

This repo is a collection of tiny offline web apps (PWAs), hosted on GitHub Pages.
No build step, no frameworks, no npm. Plain HTML, CSS and JavaScript only.

## Layout

```
index.html        Landing page. Lists every tiny app and links to its folder.
sw.js             Service worker for the landing page only.
<app>/            One folder per tiny app (example: loan/)
  index.html      The whole app in ONE file (HTML + CSS + JS inline).
  sw.js           This app's own service worker (offline cache).
  manifest.webmanifest   Name, colors and icon, so it can be added to the home screen.
  icon.png        App icon (512x512, 3 colors max, small file size).
```

## Rules

- Every app lives in its own folder. Never mix one app's files into another's folder or the root.
- Each app is self-contained: one `index.html` with inline CSS and JS. Use relative paths only.
- Each app has its own `sw.js`, registered with `scope: './'` from its own folder, so apps never clash.
- Service workers: network first, fall back to cache when offline. Precache the app's own files.
- Every service worker uses the same cache name: `tiny-apps`. Do not change it.
- The root `index.html` (hub) is itself installable: it has its own `manifest.webmanifest` and `icon.png` in the root.
- Data is stored on the device (localStorage or IndexedDB). No servers, no accounts, no tracking.
- Use a unique storage key per app (example: `loanTracker.v1`) because all apps share one origin.
- Mobile first. Simple, readable, light and dark mode. Keep files small.
- Icons: PNG, 512x512, no more than three colors, as small as possible.

## Adding a new app

1. Create `<app>/` with `index.html`, `sw.js`, `manifest.webmanifest` and `icon.png`.
2. Add one line to the `APPS` list at the top of the script in the root `index.html`:
   `{ name: 'Name', file: '<app>/', icon: '<app>/icon.png', desc: 'One-line description' }`
3. Do not edit other apps while adding a new one.

## Current apps

- `loan/` Loan Tracker. Paste loan account text, it saves snapshots, shows what changed, and has a link to the lender site.
