# Theme-Aware Logo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing single logo with the approved AM Support Command light and dark SVG variants, including navbar and favicon theme synchronization.

**Architecture:** Store two script-free SVG assets with identical 64×64 geometry. EJS renders both navbar images and CSS selects the matching variant from the root `.dark` class; the existing theme lifecycle updates one identified favicon link whenever initial, manual, or system-driven theme state changes.

**Tech Stack:** SVG, EJS, CSS/Tailwind v4, vanilla JavaScript, Jest, jsdom, Puppeteer Core

## Global Constraints

- Use separate `public/assets/logo-light.svg` and `public/assets/logo-dark.svg` files with `viewBox="0 0 64 64"`.
- SVG assets contain no scripts, external resources, embedded text, or font dependency.
- Preserve the existing localized brand-link accessible name and visible “Abdullah Al Mamun” text.
- Keep both navbar images at explicit 36×36 dimensions with empty alt text.
- Do not change locale dictionaries, routes, content, the social card, or Resume assets.
- Add no dependency and no inline executable code.
- Add `.superpowers/` to `.gitignore`; never commit visual-companion artifacts.
- Preserve `logs/combined.log` unstaged.

---

### Task 1: Add theme-specific SVG assets and navbar presentation

**Files:**
- Create: `public/assets/logo-light.svg`
- Create: `public/assets/logo-dark.svg`
- Modify: `views/partials/navbar.ejs`
- Modify: `views/partials/head.ejs`
- Modify: `public/css/input.css`
- Modify: `.gitignore`
- Modify: `tests/page.test.js`
- Create: `docs/superpowers/plans/2026-08-08-theme-aware-logo.md`

**Interfaces:**
- Consumes: the root `.dark` class established by `public/js/theme-init.js` and the existing `.brand` navigation link.
- Produces: `.brand-mark`, `.brand-logo-light`, `.brand-logo-dark`, and `#site-favicon`; Task 2 relies on the favicon ID and asset paths.

- [ ] **Step 1: Add failing server-rendered logo assertions**

Add this test to `tests/page.test.js`:

```js
it('renders theme-aware brand and favicon assets', () => {
  const logos = [...page.querySelectorAll('.brand-mark img')];

  expect(logos.map((logo) => logo.getAttribute('src'))).toEqual([
    '/assets/logo-light.svg',
    '/assets/logo-dark.svg',
  ]);
  logos.forEach((logo) => {
    expect(logo.getAttribute('alt')).toBe('');
    expect(logo.getAttribute('width')).toBe('36');
    expect(logo.getAttribute('height')).toBe('36');
  });
  expect(page.getElementById('site-favicon').getAttribute('href')).toBe(
    '/assets/logo-light.svg'
  );
  expect(page.querySelector('link[rel="apple-touch-icon"]').getAttribute('href')).toBe(
    '/assets/logo-light.svg'
  );
});
```

Extend the CSS source assertion to require `.brand-logo-dark` and `.dark .brand-logo-light`.

- [ ] **Step 2: Run the page suite and verify RED**

Run:

```bash
npm test -- --runInBand tests/page.test.js
```

Expected: FAIL because `.brand-mark`, both new asset paths, and `#site-favicon` do not exist.

- [ ] **Step 3: Create the two approved SVG assets**

Use this geometry for `public/assets/logo-light.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><linearGradient id="edge" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse"><stop stop-color="#2444a5"/><stop offset="1" stop-color="#22a9c5"/></linearGradient></defs>
  <path d="M32 3 56 13v18c0 14-9.4 23.4-24 29C17.4 54.4 8 45 8 31V13Z" fill="#eef2ff" stroke="url(#edge)" stroke-width="2.4"/>
  <path d="m16 33 7-6-7-6" fill="none" stroke="#3157c8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M23 45 32 19h6l10 26h-7l-2.2-6H30l-2 6Zm9-12h5l-2.7-7.5Z" fill="#2444a5"/>
  <path d="M41 20v14l5-6 4 5V20Z" fill="#22a9c5"/>
  <path d="M17 49h16" stroke="#3157c8" stroke-width="3" stroke-linecap="round"/>
  <circle cx="49.5" cy="17" r="4" fill="#22a9c5" stroke="#eef2ff" stroke-width="2"/>
</svg>
```

Use the same geometry for `public/assets/logo-dark.svg`, replacing the light colors as follows:

```text
#eef2ff → #121b2e
#2444a5 → #9cadff
#3157c8 → #7895ff
#22a9c5 → #4dd6e8
```

- [ ] **Step 4: Render and style both navbar variants**

Replace the current brand image in `views/partials/navbar.ejs` with:

```ejs
<span class="brand-mark" aria-hidden="true">
  <img class="brand-logo-light" src="/assets/logo-light.svg" alt="" width="36" height="36" />
  <img class="brand-logo-dark" src="/assets/logo-dark.svg" alt="" width="36" height="36" />
</span>
```

Replace the favicon metadata in `views/partials/head.ejs` with:

```ejs
<link id="site-favicon" rel="icon" type="image/svg+xml" href="/assets/logo-light.svg" />
<link rel="apple-touch-icon" href="/assets/logo-light.svg" />
```

Replace `.brand img` sizing in `public/css/input.css` with:

```css
.brand-mark {
  position: relative;
  width: 2.25rem;
  height: 2.25rem;
  flex: none;
}

.brand-mark img {
  position: absolute;
  inset: 0;
  width: 2.25rem;
  height: 2.25rem;
}

.brand-logo-dark,
.dark .brand-logo-light {
  display: none;
}

.dark .brand-logo-dark {
  display: block;
}
```

Add `.superpowers/` to `.gitignore`.

- [ ] **Step 5: Run the page suite and verify GREEN**

Run:

```bash
npm test -- --runInBand tests/page.test.js
```

Expected: all page tests pass.

- [ ] **Step 6: Commit the logo assets and presentation layer**

Run:

```bash
git add .gitignore public/assets/logo-light.svg public/assets/logo-dark.svg public/css/input.css views/partials/navbar.ejs views/partials/head.ejs tests/page.test.js docs/superpowers/plans/2026-08-08-theme-aware-logo.md
git commit -m "feat: add theme-aware portfolio logo"
```

Expected: visual-companion files and `logs/combined.log` are not staged.

---

### Task 2: Synchronize favicon with the complete theme lifecycle

**Files:**
- Modify: `public/js/theme-init.js`
- Modify: `public/js/script.js`
- Modify: `tests/frontend.test.js`

**Interfaces:**
- Consumes: `#site-favicon`, `/assets/logo-light.svg`, `/assets/logo-dark.svg`, `resolveTheme(storedTheme, prefersDark)`, and the existing theme-toggle lifecycle.
- Produces: `syncThemeFavicon(documentRef, theme): void` and exported `initTheme(documentRef, messages): void`.

- [ ] **Step 1: Add failing favicon lifecycle tests**

Add a direct helper test:

```js
it('selects the favicon that matches the active theme', () => {
  document.head.innerHTML = '<link id="site-favicon" href="/assets/logo-light.svg">';

  portfolio.syncThemeFavicon(document, 'dark');
  expect(document.getElementById('site-favicon').getAttribute('href')).toBe(
    '/assets/logo-dark.svg'
  );
  portfolio.syncThemeFavicon(document, 'light');
  expect(document.getElementById('site-favicon').getAttribute('href')).toBe(
    '/assets/logo-light.svg'
  );
});
```

Add an integration test that stubs `window.matchMedia`, calls exported `initTheme`, verifies initial dark selection, invokes the registered system-change callback to reach light, clicks `#theme-toggle` to persist dark, and confirms later system changes do not override the saved preference.

- [ ] **Step 2: Run frontend tests and verify RED**

Run:

```bash
npm test -- --runInBand tests/frontend.test.js
```

Expected: FAIL because `syncThemeFavicon` and exported `initTheme` are unavailable.

- [ ] **Step 3: Implement reusable favicon synchronization**

Add this function to `public/js/script.js` before `initTheme`:

```js
const syncThemeFavicon = (documentRef, theme) => {
  const favicon = documentRef.getElementById('site-favicon');
  if (!favicon) return;
  favicon.setAttribute(
    'href',
    theme === 'dark' ? '/assets/logo-dark.svg' : '/assets/logo-light.svg'
  );
};
```

Call `syncThemeFavicon(documentRef, theme)` inside `applyTheme`, and export both `syncThemeFavicon` and `initTheme` from the factory return object.

In `public/js/theme-init.js`, after choosing and applying `theme`, add:

```js
const favicon = document.getElementById('site-favicon');
if (favicon) {
  favicon.setAttribute(
    'href',
    theme === 'dark' ? '/assets/logo-dark.svg' : '/assets/logo-light.svg'
  );
}
```

Keep the existing catch fallback and set the light favicon there when the link exists.

- [ ] **Step 4: Run frontend and full suites**

Run:

```bash
npm test -- --runInBand tests/frontend.test.js
npm test -- --runInBand
```

Expected: frontend tests and the complete suite pass.

- [ ] **Step 5: Commit theme synchronization**

Run:

```bash
git add public/js/theme-init.js public/js/script.js tests/frontend.test.js
git commit -m "feat: synchronize logo favicon with theme"
```

---

### Task 3: Build and visually verify both themes

**Files:**
- Verify: `public/assets/logo-light.svg`
- Verify: `public/assets/logo-dark.svg`
- Verify: `public/css/input.css`
- Verify: repository working tree

**Interfaces:**
- Consumes: the completed navbar assets and favicon theme lifecycle.
- Produces: verified desktop/mobile light/dark presentation ready for `main`.

- [ ] **Step 1: Run production and repository integrity checks**

Run:

```bash
npm run build:css
npm test -- --runInBand
node -e "const fs=require('fs'); for(const file of ['public/assets/logo-light.svg','public/assets/logo-dark.svg']) { const svg=fs.readFileSync(file,'utf8'); if(!svg.includes('viewBox=\"0 0 64 64\"') || /<script|https?:\/\//i.test(svg)) process.exit(1); } console.log('SVG assets valid')"
rg -n '/favicon.svg' views && exit 1 || true
git diff --check
git status --short
```

Expected: CSS and tests pass; both SVGs are local and script-free; no view references `/favicon.svg`; only `logs/combined.log` remains uncommitted.

- [ ] **Step 2: Verify in a real browser**

Start the production server with file logging disabled:

```bash
PORT=3100 NODE_ENV=production VERCEL=1 npm start
```

Use headless Chrome at 1440×1000 and 390×844. At each viewport, capture light and dark screenshots and assert:

```text
exactly one navbar logo is visible
visible logo source matches the active theme
favicon href matches the active theme
brand link keeps its accessible name
no horizontal overflow
theme toggle changes logo and favicon without reload
```

- [ ] **Step 3: Perform final verification and push**

Run the verification-before-completion and finishing-development-branch workflows. Confirm local `main` and `origin/main` resolve to the same commit after the approved push, while `logs/combined.log` remains local and unstaged.
