# WhatToPack — Marketing Website

Static marketing site for the WhatToPack Android app. Plain HTML/CSS/JS — no build step, no framework, nothing to compile.

## Structure

```
index.html          Main landing page
privacy.html         Privacy policy
terms.html           Terms & conditions
support.html         Support / troubleshooting
css/style.css        Design tokens + all styles
js/main.js           Header scroll state, mobile nav, scroll reveals, screenshot tabs, FAQ accordion
assets/              Optimized images (webp + png fallback), generated from /reference
scripts/optimize-images.mjs   One-time script that (re)generates /assets from /reference
reference/            Source assets provided for the rebuild (app icon, screenshots, promo graphic) — do not edit
```

## Run locally

No build step — open `index.html` directly, or serve it:

```bash
npx serve .
```

## Regenerating assets

If the files in `/reference` change, re-run the image optimizer (requires `npm install` once for `sharp`):

```bash
npm install
npm run optimize-images
```

## Notes / limitations

- Content (features, FAQ, privacy/terms/support text) is sourced from the app's README and the previously live site — nothing invented.
- No user counts, ratings, or download numbers are shown since none were supplied.
- `whattopack.app` in canonical/OG tags is a placeholder domain — update it once the site has a real one.
