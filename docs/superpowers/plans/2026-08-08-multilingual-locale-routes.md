# Multilingual Locale Routes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver complete server-rendered portfolio translations for American English, Bangla, Hindi, Arabic, Spanish, and French with accessible language switching and locale-specific SEO.

**Architecture:** Locale JSON files provide one canonical key contract. `utils/i18n.js` loads and validates dictionaries, builds rendering context, and supplies a fallback translator; Express renders `/` and five explicit locale routes through one handler. EJS owns translated static content, while a nonce-authorized JSON payload supplies only dynamic interaction messages to the existing browser script.

**Tech Stack:** Node.js, Express 4, EJS, vanilla JavaScript, CSS logical properties, Jest, Supertest, jsdom, and jest-axe.

## Global Constraints

- American English is always the default at `/`; never redirect from browser language.
- Locale routes are exactly `/bn`, `/hi`, `/ar`, `/es`, and `/fr`.
- Arabic renders `lang="ar" dir="rtl"`; every other locale renders `dir="ltr"`.
- All visible text and accessibility labels are translated, while personal names, company names, institution names, project names, technology names, contact details, dates, numbers, and URLs remain unchanged.
- Translation values are plain text; EJS retains all markup and icons.
- Missing keys fall back to `en-US`; malformed locale files fail with a specific locale/key error.
- No external translation service, browser-language redirect, translation dashboard, or translated résumé PDF.
- Preserve the existing CSP nonce model, contact security, animations, responsive design, and accessibility behavior.
- Keep the pre-existing `logs/combined.log` modification unstaged.

---

### Task 1: Locale registry, dictionary contract, and fallback translator

**Files:**
- Create: `utils/i18n.js`
- Create: `locales/en-US.json`
- Create: `locales/bn.json`
- Create: `locales/hi.json`
- Create: `locales/ar.json`
- Create: `locales/es.json`
- Create: `locales/fr.json`
- Create: `tests/i18n.test.js`

**Interfaces:**
- Produces: `DEFAULT_LOCALE`, `SUPPORTED_LOCALES`, `getLocale(code)`, `getTranslator(code)`, `getFlatKeys(value)`, `getLocalePath(code)`, `getAlternateLinks()`, `getClientMessages(code)`, and `buildPageContext(code, overrides)`.
- `getTranslator(code)` returns a function `t(key)` that returns a string and falls back to `en-US` when a key is absent.
- `buildPageContext(code, overrides)` returns `{ locale, lang, dir, t, languages, canonicalUrl, alternateLinks, clientMessages, serializedClientMessages, ...overrides }`.

- [ ] **Step 1: Write the failing locale-contract tests**

```js
const {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  getTranslator,
  getFlatKeys,
  getLocalePath,
  buildPageContext,
} = require('../utils/i18n');

const getLeafValues = (value) => Object.values(value).flatMap((entry) =>
  entry && typeof entry === 'object' && !Array.isArray(entry) ? getLeafValues(entry) : [entry]
);

describe('portfolio locale dictionaries', () => {
  it('defines the approved locale order and routes', () => {
    expect(DEFAULT_LOCALE).toBe('en-US');
    expect(SUPPORTED_LOCALES.map(({ code, path, dir }) => ({ code, path, dir }))).toEqual([
      { code: 'en-US', path: '/', dir: 'ltr' },
      { code: 'bn', path: '/bn', dir: 'ltr' },
      { code: 'hi', path: '/hi', dir: 'ltr' },
      { code: 'ar', path: '/ar', dir: 'rtl' },
      { code: 'es', path: '/es', dir: 'ltr' },
      { code: 'fr', path: '/fr', dir: 'ltr' },
    ]);
  });

  it.each(['bn', 'hi', 'ar', 'es', 'fr'])('%s has the complete English key contract', (code) => {
    const english = require('../locales/en-US.json');
    const translated = require(`../locales/${code}.json`);
    expect(getFlatKeys(translated)).toEqual(getFlatKeys(english));
    expect(getLeafValues(translated).every((value) =>
      Array.isArray(value)
        ? value.length > 0 && value.every((item) => typeof item === 'string' && item.trim())
        : typeof value === 'string' && value.trim()
    )).toBe(true);
  });

  it('falls back to American English for a missing translated key', () => {
    expect(getTranslator('bn')('hero.title')).toBe('টেকনিক্যাল সাপোর্ট ইঞ্জিনিয়ার');
    expect(getTranslator('unsupported')('hero.title')).toBe('Technical Support Engineer');
    expect(getTranslator('bn')('missing.key')).toBe('missing.key');
  });

  it('builds safe locale paths and Arabic rendering context', () => {
    expect(getLocalePath('en-US')).toBe('/');
    expect(getLocalePath('fr')).toBe('/fr');
    expect(buildPageContext('ar')).toMatchObject({ lang: 'ar', dir: 'rtl' });
  });
});
```

- [ ] **Step 2: Run the tests and verify the missing-module failure**

Run: `npm test -- --runInBand tests/i18n.test.js`

Expected: FAIL because `utils/i18n.js` and locale JSON files do not exist.

- [ ] **Step 3: Implement the locale registry and translator**

```js
const dictionaries = {
  'en-US': require('../locales/en-US.json'),
  bn: require('../locales/bn.json'),
  hi: require('../locales/hi.json'),
  ar: require('../locales/ar.json'),
  es: require('../locales/es.json'),
  fr: require('../locales/fr.json'),
};

const DEFAULT_LOCALE = 'en-US';
const BASE_URL = 'https://mamunsandwipi.vercel.app';
const SUPPORTED_LOCALES = [
  { code: 'en-US', path: '/', lang: 'en-US', dir: 'ltr', nativeName: 'English (US)' },
  { code: 'bn', path: '/bn', lang: 'bn', dir: 'ltr', nativeName: 'বাংলা' },
  { code: 'hi', path: '/hi', lang: 'hi', dir: 'ltr', nativeName: 'हिन्दी' },
  { code: 'ar', path: '/ar', lang: 'ar', dir: 'rtl', nativeName: 'العربية' },
  { code: 'es', path: '/es', lang: 'es', dir: 'ltr', nativeName: 'Español' },
  { code: 'fr', path: '/fr', lang: 'fr', dir: 'ltr', nativeName: 'Français' },
];

const readKey = (source, key) => key.split('.').reduce((value, part) => value?.[part], source);
const getLocale = (code) => SUPPORTED_LOCALES.find((item) => item.code === code)
  || SUPPORTED_LOCALES[0];
const getTranslator = (code) => (key) =>
  readKey(dictionaries[getLocale(code).code], key)
  ?? readKey(dictionaries[DEFAULT_LOCALE], key)
  ?? key;
```

Complete `en-US.json` by moving every translatable string from `views/index.ejs`, `views/partials/head.ejs`, `views/partials/navbar.ejs`, `views/partials/footer.ejs`, `views/404.ejs`, and the dynamic strings in `public/js/script.js` into semantic nested keys. Create human-authored Bangla, Hindi, Arabic, Spanish, and French values for that exact key set. Validate recursively that every leaf is a non-empty string or, for `client.typewriterPhrases`, a non-empty string array.

Serialize the restricted client subset with `JSON.stringify(clientMessages).replace(/</g, '\\u003c')` so translated content cannot terminate the `application/json` element.

- [ ] **Step 4: Run the locale tests and verify green**

Run: `npm test -- --runInBand tests/i18n.test.js`

Expected: PASS with all six dictionaries sharing the same flattened key set.

- [ ] **Step 5: Commit the locale foundation**

```bash
git add utils/i18n.js locales tests/i18n.test.js
git commit -m "feat: add portfolio locale dictionaries"
```

### Task 2: Server-rendered locale routes and localized 404 context

**Files:**
- Modify: `routes/index.js`
- Modify: `app.js`
- Modify: `tests/routes.test.js`

**Interfaces:**
- Consumes: `buildPageContext(code, overrides)` and `getLocale(code)` from Task 1.
- Produces: `GET /`, `GET /bn`, `GET /hi`, `GET /ar`, `GET /es`, and `GET /fr` portfolio pages; known-prefix localized 404 rendering.

- [ ] **Step 1: Add failing route tests**

```js
it.each([
  ['/', 'en-US', 'Technical Support Engineer'],
  ['/bn', 'bn', 'টেকনিক্যাল সাপোর্ট ইঞ্জিনিয়ার'],
  ['/hi', 'hi', 'तकनीकी सहायता अभियंता'],
  ['/ar', 'ar', 'مهندس دعم فني'],
  ['/es', 'es', 'Ingeniero de soporte técnico'],
  ['/fr', 'fr', 'Ingénieur support technique'],
])('renders %s as %s', async (path, lang, title) => {
  const res = await request(app).get(path);
  expect(res.status).toBe(200);
  expect(res.text).toContain(`lang="${lang}"`);
  expect(res.text).toContain(title);
});

it('renders known-prefix Arabic 404 content in RTL', async () => {
  const res = await request(app).get('/ar/missing');
  expect(res.status).toBe(404);
  expect(res.text).toContain('dir="rtl"');
  expect(res.text).toContain('الصفحة غير موجودة');
});
```

- [ ] **Step 2: Run route tests and verify the localized routes fail**

Run: `npm test -- --runInBand tests/routes.test.js`

Expected: FAIL because locale routes and localized page context are absent.

- [ ] **Step 3: Implement one shared portfolio renderer and locale-aware 404**

```js
const renderPortfolio = (locale) => (req, res) => {
  res.render('index', buildPageContext(locale));
};

router.get('/', renderPortfolio('en-US'));
['bn', 'hi', 'ar', 'es', 'fr'].forEach((locale) => {
  router.get(`/${locale}`, renderPortfolio(locale));
});
```

In `app.js`, resolve the first path segment only when it is a supported locale and render `views/404.ejs` with `buildPageContext(locale, { metaRobots: 'noindex, nofollow', canonicalUrl: null, includeStructuredData: false })`.

- [ ] **Step 4: Run route tests and verify green**

Run: `npm test -- --runInBand tests/routes.test.js`

Expected: PASS for all locale routes, RTL Arabic, CSP nonce, contact responses, payload limit, and localized 404 behavior.

- [ ] **Step 5: Commit locale routing**

```bash
git add routes/index.js app.js tests/routes.test.js
git commit -m "feat: render locale-specific portfolio routes"
```

### Task 3: Translate EJS content and add the language selector

**Files:**
- Modify: `views/index.ejs`
- Modify: `views/partials/head.ejs`
- Modify: `views/partials/navbar.ejs`
- Modify: `views/partials/footer.ejs`
- Modify: `views/404.ejs`
- Modify: `tests/page.test.js`

**Interfaces:**
- Consumes: EJS locals from `buildPageContext`: `locale`, `lang`, `dir`, `t`, `languages`, `canonicalUrl`, `alternateLinks`, `serializedClientMessages`.
- Produces: translated HTML with stable DOM IDs/classes and a `.language-switcher` containing six route links.

- [ ] **Step 1: Add failing document tests for language links, metadata, and translated accessibility**

```js
const renderPortfolio = async (locale = 'en-US') => {
  const context = buildPageContext(locale, { cspNonce: 'test-nonce' });
  const html = await ejs.renderFile(path.join(__dirname, '..', 'views', 'index.ejs'), context);
  return new DOMParser().parseFromString(html, 'text/html');
};

it('renders six language routes and marks the selected locale', async () => {
  const page = await renderPortfolio('fr');
  const links = page.querySelectorAll('[data-language-option]');
  expect(links).toHaveLength(6);
  expect(page.querySelector('[data-language-option][aria-current="page"]').getAttribute('href')).toBe('/fr');
});

it('renders locale canonical and complete hreflang alternates', async () => {
  const page = await renderPortfolio('bn');
  expect(page.querySelector('link[rel="canonical"]').getAttribute('href')).toBe('https://mamunsandwipi.vercel.app/bn');
  expect(page.querySelectorAll('link[rel="alternate"][hreflang]')).toHaveLength(7);
});
```

- [ ] **Step 2: Run page tests and verify they fail for missing locale markup**

Run: `npm test -- --runInBand tests/page.test.js`

Expected: FAIL because the templates still contain literal English and no selector/hreflang links.

- [ ] **Step 3: Convert templates to translator keys without changing semantic structure**

Use `<%= t('key') %>` for text nodes and attributes, set `<html lang="<%= lang %>" dir="<%= dir %>">`, render metadata from `meta.*`, render all alternate links, and add:

```ejs
<div class="language-switcher">
  <button id="language-toggle" class="language-button" type="button"
    aria-expanded="false" aria-controls="language-menu"
    aria-label="<%= t('language.open') %>">
    <i class="fas fa-language" aria-hidden="true"></i>
    <span><%= languages.find(item => item.code === locale).nativeName %></span>
  </button>
  <div id="language-menu" class="language-menu" hidden>
    <% languages.forEach((language) => { %>
      <a href="<%= language.path %>" lang="<%= language.lang %>" dir="<%= language.dir %>"
        data-language-option <%= language.code === locale ? 'aria-current="page"' : '' %>>
        <%= language.nativeName %>
      </a>
    <% }) %>
  </div>
</div>
```

Render `<script id="locale-data" type="application/json" nonce="<%= cspNonce %>"><%- serializedClientMessages %></script>` before the external browser scripts. Preserve names, technology labels, dates, contact details, and URLs as defined by the specification.

- [ ] **Step 4: Run page and accessibility tests**

Run: `npm test -- --runInBand tests/page.test.js`

Expected: PASS for English and Arabic axe scans, the six language links, locale metadata, the existing information architecture, project links, forms, and CSP-compatible scripts.

- [ ] **Step 5: Commit translated templates**

```bash
git add views tests/page.test.js
git commit -m "feat: render translated portfolio content"
```

### Task 4: Localize dynamic browser behavior and language-menu interaction

**Files:**
- Modify: `public/js/script.js`
- Modify: `tests/frontend.test.js`

**Interfaces:**
- Consumes: JSON from `#locale-data` with `{ locale, menu, theme, typewriterPhrases, form }`.
- Produces: `parseLocaleData(documentRef)`, `initLanguageMenu({ button, menu, documentRef })`, and `validateContactFields(values, messages)` exports.

- [ ] **Step 1: Add failing frontend behavior tests**

```js
it('uses localized contact validation messages', () => {
  const messages = { nameRequired: 'আপনার নাম লিখুন।', emailRequired: 'আপনার ইমেইল লিখুন।', messageRequired: 'আপনার বার্তা লিখুন।', messageTooShort: 'বার্তাটি কমপক্ষে ২০ অক্ষরের হতে হবে।' };
  expect(portfolio.validateContactFields({ name: '', email: '', message: '' }, messages)).toEqual({
    name: messages.nameRequired,
    email: messages.emailRequired,
    message: messages.messageRequired,
  });
});

it('closes the language menu with Escape and returns focus', () => {
  document.body.innerHTML = '<button id="toggle" aria-expanded="false"></button><div id="menu" hidden><a href="/bn">বাংলা</a></div>';
  const button = document.getElementById('toggle');
  const menu = document.getElementById('menu');
  portfolio.initLanguageMenu({ button, menu, documentRef: document }).open();
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  expect(menu.hidden).toBe(true);
  expect(document.activeElement).toBe(button);
});
```

- [ ] **Step 2: Run frontend tests and verify the new behavior fails**

Run: `npm test -- --runInBand tests/frontend.test.js`

Expected: FAIL because validation accepts no message map and `initLanguageMenu` is undefined.

- [ ] **Step 3: Implement locale parsing, localized messages, and accessible menu behavior**

```js
const parseLocaleData = (documentRef) => {
  const source = documentRef.getElementById('locale-data');
  if (!source) return { locale: 'en-US', typewriterPhrases: [], form: {} };
  try { return JSON.parse(source.textContent); }
  catch { return { locale: 'en-US', typewriterPhrases: [], form: {} }; }
};

const initLanguageMenu = ({ button, menu, documentRef }) => {
  const open = () => {
    menu.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    menu.querySelector('a')?.focus();
  };
  const close = ({ restoreFocus = false } = {}) => {
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    if (restoreFocus) button.focus();
  };
  button.addEventListener('click', () => menu.hidden ? open() : close({ restoreFocus: true }));
  documentRef.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) close({ restoreFocus: true });
  });
  documentRef.addEventListener('click', (event) => {
    if (!menu.hidden && !menu.contains(event.target) && !button.contains(event.target)) close();
  });
  return { open, close };
};
```

Pass locale form messages into validation, populate typewriter phrases from locale data, localize theme/mobile button labels, and send `Accept-Language: localeData.locale` with contact submissions. Display local `form.success`, `form.serviceError`, and `form.unexpectedResponse` strings instead of untranslated server text.

- [ ] **Step 4: Run frontend and page tests**

Run: `npm test -- --runInBand tests/frontend.test.js tests/page.test.js`

Expected: PASS with localized validation and accessible language-menu behavior.

- [ ] **Step 5: Commit browser localization**

```bash
git add public/js/script.js tests/frontend.test.js
git commit -m "feat: localize portfolio interactions"
```

### Task 5: Responsive language UI, RTL layout, sitemap, and documentation

**Files:**
- Modify: `public/css/input.css`
- Modify: `public/sitemap.xml`
- Modify: `README.md`
- Modify: `swagger.json`
- Modify: `tests/page.test.js`

**Interfaces:**
- Consumes: `.language-switcher`, `.language-button`, `.language-menu`, `[dir="rtl"]`, and the six locale URLs.
- Produces: responsive selector styles, Arabic RTL alignment, complete locale sitemap, and documented routes.

- [ ] **Step 1: Add failing sitemap and RTL structure assertions**

```js
it('publishes all locale routes in the sitemap', () => {
  const sitemap = fs.readFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), 'utf8');
  ['/', '/bn', '/hi', '/ar', '/es', '/fr'].forEach((route) => {
    expect(sitemap).toContain(`https://mamunsandwipi.vercel.app${route === '/' ? '/' : route}`);
  });
});

it('includes RTL layout rules for Arabic pages', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'css', 'input.css'), 'utf8');
  expect(css).toContain('[dir="rtl"]');
  expect(css).toContain('.language-menu');
});
```

- [ ] **Step 2: Run page tests and verify sitemap/style failures**

Run: `npm test -- --runInBand tests/page.test.js`

Expected: FAIL because the sitemap has one URL and the selector/RTL rules do not exist.

- [ ] **Step 3: Add selector and RTL CSS using logical properties**

```css
.language-switcher { position: relative; }
.language-button { display: inline-flex; align-items: center; gap: .5rem; }
.language-menu { position: absolute; inset-block-start: calc(100% + .5rem); inset-inline-end: 0; min-width: 11rem; }
.language-menu[hidden] { display: none; }
[dir="rtl"] .timeline-item { direction: rtl; }
[dir="rtl"] .timeline-content li { padding-inline-start: 0; padding-inline-end: 1.25rem; }
```

Keep the desktop selector label visible when space permits and use the language icon plus current language code at tablet/mobile widths. Ensure the menu stays inside the viewport and its own language names retain their declared direction.

- [ ] **Step 4: Publish locale URLs and update project documentation**

List all six canonical URLs in `public/sitemap.xml`, describe locale routes and translation maintenance in `README.md`, and document `Accept-Language` as an optional contact request header in `swagger.json`.

- [ ] **Step 5: Build CSS and run page tests**

Run: `npm run build:css`

Expected: Tailwind CSS exits 0 and writes minified `public/css/output.css`.

Run: `npm test -- --runInBand tests/page.test.js`

Expected: PASS for sitemap, RTL rules, locale metadata, page structure, and accessibility.

- [ ] **Step 6: Commit presentation and documentation**

```bash
git add public/css/input.css public/sitemap.xml README.md swagger.json tests/page.test.js
git commit -m "feat: complete multilingual presentation and SEO"
```

### Task 6: Full regression and visual verification

**Files:**
- Verify: all files modified in Tasks 1–5

**Interfaces:**
- Consumes: final working tree.
- Produces: evidence that the multilingual implementation meets the specification without regressions.

- [ ] **Step 1: Run the full automated suite**

Run: `npm test -- --runInBand`

Expected: all test suites pass with zero failed tests.

- [ ] **Step 2: Run production and repository checks**

Run: `npm run build:css`

Expected: exit 0.

Run: `npm audit`

Expected: `found 0 vulnerabilities`.

Run: `git diff --check`

Expected: no output and exit 0.

- [ ] **Step 3: Inspect all locale pages in a real browser**

Start `PORT=3100 NODE_ENV=production npm start`. Capture full-page desktop screenshots at 1440×1000 and mobile screenshots at 390×844 for `/`, `/bn`, `/hi`, `/ar`, `/es`, and `/fr`. Verify the language menu, complete translated content, wrapping, focus behavior, contact form, footer, and no horizontal overflow. Inspect `/ar` specifically for RTL order and alignment.

- [ ] **Step 4: Verify canonical and alternate links from the running server**

For every locale route, confirm the HTTP response is 200, its canonical URL is self-referencing, it has six locale alternates plus `x-default`, and its CSP authorizes the locale JSON nonce.

- [ ] **Step 5: Review the final status without staging user logs**

Run: `git status --short`

Expected: implementation files are committed and the pre-existing `logs/combined.log` modification remains unstaged.
