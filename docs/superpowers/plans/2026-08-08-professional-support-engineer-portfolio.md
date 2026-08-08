# Professional Technical Support Engineer Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Abdullah Al Mamun's portfolio and English resume around a single, evidence-backed Technical Support Engineer identity while preserving the current multilingual, theme, contact, accessibility, and deployment behavior.

**Architecture:** Keep the existing Express/EJS application, six JSON locale dictionaries, Tailwind-generated stylesheet, and vanilla browser JavaScript. Render all evidence as authored server-side content: two public repository case studies, one private redacted case study with no repository URL, and no client-side repository fetches. Preserve the current routes and contact API, and regenerate the existing PDF from the revised static resume HTML.

**Tech Stack:** Node.js, Express, EJS, Tailwind CSS v4, vanilla JavaScript, Jest, jsdom, jest-axe, Supertest, Puppeteer/Chrome, PDF utilities.

## Global Constraints

- Treat the approved design at `docs/superpowers/specs/2026-08-08-professional-support-engineer-portfolio-design.md` as the source of truth.
- Do not add facts, tools, ticket volumes, percentages, SLAs, satisfaction scores, performance claims, or outcomes that are absent from the CV, Git history, repository documentation, or direct user confirmation.
- Keep "Open to remote opportunities."
- State that the portfolio is available in six languages; never imply that Abdullah speaks six languages.
- The later GitHub-history design supersedes the original metric set. Use `7+` years in technology, public repository history `Since 2022`, and `3` industries.
- Keep personal language claims exactly at `Bangla — Fluent` and `English — Good` in English content, with faithful translations elsewhere.
- Use "production-grade feature scope" only for Emergency Medicine Finder, followed by visible limitations. Never describe it positively as production-ready, deployment-ready, secure, or hardened.
- Never imply that collaborative work was completed alone. House Shifting Services may only appear as an attribution note explaining that it is collaborative and not primary evidence.
- Exclude PCIU CGPA Calculator everywhere.
- Keep Smart Attendance Tracker private: no repository link, remote URL, credentials, personal attendance data, employer name, spreadsheet identifier, or confidential screenshot.
- Do not add Active Directory, Microsoft 365, ticketing/ITSM products, SLA management, or remote-support tools.
- Preserve `GET /`, all localized `GET` routes, `POST /contact`, `/Abdullah Al Mamun Resume.pdf`, CSP behavior, and the contact request/response contract.
- Preserve unrelated user changes, especially the existing modified `logs/combined.log`; never stage or commit it.

---

## Task 1: Establish the multilingual support-content contract

**Files:**

- Modify: `tests/i18n.test.js`
- Modify: `locales/en-US.json`
- Modify: `locales/bn.json`
- Modify: `locales/hi.json`
- Modify: `locales/ar.json`
- Modify: `locales/es.json`
- Modify: `locales/fr.json`

- [ ] **Step 1: Add failing locale-contract tests**

Extend `tests/i18n.test.js` so it requires the new sections and integrity-sensitive copy while retaining the existing exact-key-parity and non-empty-value checks:

```js
it('defines the approved support-first English content contract', () => {
  const english = require('../locales/en-US.json');

  expect(english.hero).toMatchObject({
    status: 'Open to Technical Support opportunities',
    role: 'Technical Support Engineer',
    eyebrow: 'User support · Website support · IT operations',
    title: 'Clear support for people, software, and systems.',
    primaryAction: 'View support experience',
    secondaryAction: 'Contact me',
  });
  expect(english.metrics).toMatchObject({
    years: 'Years in technology',
    repositorySince: 'Since 2022',
    repositoryHistory: 'Public repository history',
    githubProfile: 'View GitHub profile',
    industries: 'Industries supported',
  });
  expect(english).toHaveProperty('approach.documentTitle', 'Document');
  expect(english).toHaveProperty('evidence.attendancePrivate', 'Private case study');
  expect(english).toHaveProperty('contact.remote', 'Open to remote opportunities');
});

it.each(['bn', 'hi', 'ar', 'es', 'fr'])(
  '%s localizes dates, support copy, and the English resume label',
  (code) => {
    const english = require('../locales/en-US.json');
    const translated = require(`../locales/${code}.json`);

    [
      'hero.title',
      'experience.bitAppsDate',
      'experience.seniorDate',
      'experience.juniorDate',
      'approach.title',
      'evidence.title',
      'nav.englishResume',
    ].forEach((key) => {
      expect(readKey(translated, key)).not.toBe(readKey(english, key));
    });
  }
);
```

Add a local `readKey` test helper matching the production dot-path lookup. Keep the existing Arabic `dir: 'rtl'` assertion.

- [ ] **Step 2: Run the focused test and confirm failure**

Run:

```bash
npm test -- --runInBand tests/i18n.test.js
```

Expected: FAIL because `hero.role`, localized dates, `approach`, `evidence`, `contact.remote`, and `nav.englishResume` do not exist.

- [ ] **Step 3: Add the new key contract to all six dictionaries**

Retain the existing error, menu, theme, metadata, not-found, and accessibility translations. Add matching keys to every locale. Use this English copy as the authoritative meaning:

```json
{
  "nav": {
    "summary": "Summary",
    "experience": "Experience",
    "approach": "Approach",
    "evidence": "Evidence",
    "skills": "Skills",
    "contact": "Contact",
    "englishResume": "English resume"
  },
  "hero": {
    "status": "Open to Technical Support opportunities",
    "role": "Technical Support Engineer",
    "eyebrow": "User support · Website support · IT operations",
    "title": "Clear support for people, software, and systems.",
    "intro": "I diagnose hardware, software, website, access, and workflow issues; reproduce and document defects; and coordinate clear resolutions between users, clients, and technical teams.",
    "primaryAction": "View support experience",
    "secondaryAction": "Contact me",
    "focusValue": "User support and reliable operations"
  },
  "metrics": {
    "years": "Years in technology",
    "repositorySince": "Since 2022",
    "repositoryHistory": "Public repository history",
    "githubProfile": "View GitHub profile",
    "industries": "Industries supported"
  },
  "experience": {
    "bitAppsDate": "May 2025 — Present",
    "seniorDate": "January 2020 — April 2025",
    "juniorDate": "January 2019 — December 2019"
  },
  "approach": {
    "eyebrow": "Support approach",
    "title": "A clear path from issue to resolution",
    "intro": "A practical workflow for understanding impact, finding the cause, confirming the fix, and leaving useful documentation behind.",
    "listenTitle": "Listen",
    "listenBody": "Understand the user, expected behavior, environment, and impact.",
    "triageTitle": "Triage",
    "triageBody": "Assess urgency, scope, affected users, and business impact.",
    "reproduceTitle": "Reproduce",
    "reproduceBody": "Capture dependable steps, symptoms, versions, and evidence.",
    "diagnoseTitle": "Diagnose",
    "diagnoseBody": "Isolate the likely cause across software, hardware, data, or workflow.",
    "resolveTitle": "Resolve",
    "resolveBody": "Apply a safe fix, verify the result, or escalate with clear evidence.",
    "documentTitle": "Document",
    "documentBody": "Record the resolution and turn it into reusable knowledge."
  },
  "evidence": {
    "eyebrow": "Technical support evidence",
    "title": "Evidence from systems I have worked on",
    "intro": "Selected work viewed through troubleshooting, operational reliability, documentation, testing, and responsible limitations.",
    "noorCategory": "Release and troubleshooting readiness",
    "noorTitle": "Noor Notes",
    "noorBody": "An original Linux notes application with installation diagnostics, compatibility guidance, recovery and backup documentation, safe failure states, encrypted local storage, packaging checks, issue-report instructions, and automated verification.",
    "noorAlt": "Noor Notes library screen showing the application interface used for support and release documentation",
    "noorLink": "View public repository",
    "attendanceCategory": "Synchronization and operational reliability",
    "attendanceTitle": "Smart Attendance Tracker",
    "attendanceBody": "A redacted private case study covering Google Sheets and local synchronization, rate-limit retries, conflict and correction logs, status monitoring, backups, exports, caching, and offline PWA behavior.",
    "attendanceAlt": "Redacted synchronization workflow with local data, retry handling, conflict logs, backup, and export states",
    "attendancePrivate": "Private case study",
    "medicineCategory": "Supportability and remediation awareness",
    "medicineTitle": "Emergency Medicine Finder",
    "medicineBody": "A system with a production-grade feature scope across multiple roles, operational workflows, backups, exports, validation, and tests. Repository documentation also identifies remaining CSRF, rate-limit, security-header, cookie, validation, and upload-hardening work, so this is not presented as deployment-ready.",
    "medicineAlt": "Supportability review showing tested workflows, backups, diagnostics, and documented remediation priorities",
    "medicineLink": "View public repository",
    "collaborativeTitle": "Collaborative contribution",
    "collaborativeBody": "House Shifting Services is collaborative work and is not presented as a project built independently. It remains outside the primary evidence cards because individual contribution boundaries are not sufficiently documented."
  },
  "contact": {
    "availability": "Availability",
    "remote": "Open to remote opportunities",
    "locationLabel": "Location",
    "locationValue": "Sandwip, Chattogram, Bangladesh"
  }
}
```

Translate each value naturally into Bangla, Hindi, Arabic, Spanish, and French. Proper names and product names may remain unchanged. On non-English routes, `nav.englishResume` must explicitly communicate that the downloadable PDF is in English. Do not translate technical facts into broader claims.

- [ ] **Step 4: Retarget the typewriter phrases without developer positioning**

In every locale, replace the three `client.typewriterPhrases` meanings with localized versions of:

```json
["user issue investigation", "website support", "technical documentation"]
```

Update `hero.typewriterSummary` to convey those same three support themes. Do not use "full-stack development."

- [ ] **Step 5: Run locale tests and commit**

Run:

```bash
npm test -- --runInBand tests/i18n.test.js
git diff --check
git status --short
git add locales/en-US.json locales/bn.json locales/hi.json locales/ar.json locales/es.json locales/fr.json tests/i18n.test.js
git commit -m "feat: define support-first portfolio content"
```

Expected: locale tests PASS, key sets are identical and non-empty, and only intended locale/test files are staged.

---

## Task 2: Rebuild the page structure around support experience and evidence

**Files:**

- Modify: `tests/page.test.js`
- Modify: `views/index.ejs`
- Modify: `views/partials/navbar.ejs`
- Modify: `views/partials/footer.ejs`
- Modify: all six `locales/*.json` files to remove obsolete keys after the view stops using them

- [ ] **Step 1: Replace obsolete page expectations with integrity tests**

Update `tests/page.test.js` to assert the approved structure and evidence boundaries:

```js
it('uses the approved support-first information architecture', () => {
  const sectionIds = [...page.querySelectorAll('main > section[id]')]
    .map((section) => section.id);

  expect(sectionIds).toEqual([
    'home',
    'capabilities',
    'experience',
    'approach',
    'evidence',
    'skills',
    'education',
    'contact',
  ]);
});

it('presents a Technical Support Engineer identity and verified metrics', () => {
  expect(page.querySelector('[data-professional-role]').textContent.trim())
    .toBe('Technical Support Engineer');
  expect(page.querySelector('h1').textContent.trim())
    .toBe('Clear support for people, software, and systems.');
  expect(page.querySelector('[data-primary-cta]').getAttribute('href'))
    .toBe('#experience');
  expect([...page.querySelectorAll('[data-metric] strong')].map((node) => node.textContent.trim()))
    .toEqual(['7+', 'Since 2022', '3']);
});

it('renders two public evidence links and one private redacted case study', () => {
  expect(page.querySelectorAll('[data-evidence-card]')).toHaveLength(3);
  expect(page.querySelectorAll('[data-evidence-source]')).toHaveLength(2);

  const privateCard = page.querySelector('[data-private-evidence]');
  expect(privateCard).not.toBeNull();
  expect(privateCard.querySelector('a')).toBeNull();
  expect(privateCard.textContent).toContain('Private case study');
});

it('does not inflate positioning, ownership, outcomes, or readiness', () => {
  const text = page.body.textContent.replace(/\s+/g, ' ');
  expect(text).not.toMatch(/Web Developer|Full[- ]Stack Developer/i);
  expect(text).not.toMatch(/improved support team response|24\/7|minimized downtime|optimized outcomes/i);
  expect(text).not.toMatch(/\bis deployment[- ]ready\b|\bproduction[- ]ready system\b/i);
  expect(text).not.toContain('PCIU CGPA Calculator');
  expect(text).toContain('production-grade feature scope');
  expect(text).toContain('not presented as deployment-ready');
  expect(text).toContain('collaborative work');
});
```

Also assert:

- Navbar section targets are `home`, `experience`, `approach`, `evidence`, `skills`, `contact`.
- The desktop and mobile resume links still point to `/Abdullah Al Mamun Resume.pdf`.
- The repository-history metric links directly to the GitHub profile and does not claim continuous activity.
- The portfolio-language metric is labelled as a site capability.
- English experience dates come from locale content.
- The Bangla page does not contain the English date strings.
- The Diploma item has no GPA element; the B.Sc. still shows `GPA 3.76 / 4.00`.
- Existing email, phone, WhatsApp, LinkedIn, form fields, field error destinations, metadata, language routes, RTL behavior, sitemap, and axe checks remain intact.

- [ ] **Step 2: Run the focused page test and confirm failure**

Run:

```bash
npm test -- --runInBand tests/page.test.js
```

Expected: FAIL on the old hero, section IDs, project cards, metrics, and hard-coded dates.

- [ ] **Step 3: Rebuild navigation and hero**

In `views/partials/navbar.ejs`:

- Render Summary, Experience, Approach, Evidence, Skills, and Contact on desktop and mobile.
- Use matching `href` and `data-section` values.
- Preserve the brand, language selector, theme control, mobile menu state, and resume URL.
- Render `t('nav.englishResume')` for the resume action on non-English pages; retain concise `Resume` wording on English.

In `views/index.ejs`:

- Keep the skip link, ambient canvas, semantic `main`, and portrait.
- Add `<p data-professional-role>` for the localized role and make the approved sentence the `h1`.
- Change the primary CTA to `#experience` and secondary CTA to `#contact`.
- Keep GitHub, LinkedIn, and email hero links.
- Move the metric grid into the hero region directly after the main two-column content so it is visible earlier.
- Render metrics exactly as `7+`, `Since 2022`, and `3`; the middle card links to the GitHub profile.

- [ ] **Step 4: Rebuild capabilities, experience, and approach**

Use four capability cards:

1. End-user support: hardware, software, configuration, peripheral, access, and workflow assistance.
2. Website support: WordPress and HTML/CSS maintenance, browser/content issues, and reported defects.
3. Issue investigation: reproduction steps, evidence collection, root-cause isolation, escalation, and verification.
4. Knowledge sharing: troubleshooting guides, user instructions, bug reports, and handover notes.

Keep all three jobs and company names. Replace hard-coded date text with `t('experience.bitAppsDate')`, `t('experience.seniorDate')`, and `t('experience.juniorDate')`. Use present tense only for Bit Apps and past tense for Kurnia Holiday Travels and Century Securities Limited. Describe workplace hardware and software maintenance without a device count; remove or soften unsupported claims such as improved response times, 24/7 availability, minimized downtime, or optimized outcomes.

Add `section#approach` after Experience. Render the six localized steps in an ordered list so the workflow remains meaningful without CSS:

```ejs
<ol class="approach-grid">
  <li class="approach-step reveal"><span aria-hidden="true">01</span><h3><%= t('approach.listenTitle') %></h3><p><%= t('approach.listenBody') %></p></li>
  <li class="approach-step reveal"><span aria-hidden="true">02</span><h3><%= t('approach.triageTitle') %></h3><p><%= t('approach.triageBody') %></p></li>
  <li class="approach-step reveal"><span aria-hidden="true">03</span><h3><%= t('approach.reproduceTitle') %></h3><p><%= t('approach.reproduceBody') %></p></li>
  <li class="approach-step reveal"><span aria-hidden="true">04</span><h3><%= t('approach.diagnoseTitle') %></h3><p><%= t('approach.diagnoseBody') %></p></li>
  <li class="approach-step reveal"><span aria-hidden="true">05</span><h3><%= t('approach.resolveTitle') %></h3><p><%= t('approach.resolveBody') %></p></li>
  <li class="approach-step reveal"><span aria-hidden="true">06</span><h3><%= t('approach.documentTitle') %></h3><p><%= t('approach.documentBody') %></p></li>
</ol>
```

- [ ] **Step 5: Replace Projects with three evidence cards**

Create `section#evidence` with three `article[data-evidence-card]` elements in this order:

1. Noor Notes, with `data-evidence="noor-notes"` and a public link to `https://github.com/saamaamr/noor-notes`.
2. Smart Attendance Tracker, with `data-private-evidence`, a non-link private-case-study badge, and no URL.
3. Emergency Medicine Finder, with `data-evidence="emergency-medicine-finder"` and a public link to `https://github.com/saamaamr/emergency-medicine-finder`.

Add `data-evidence-source` only to the two public anchors. Render the exact localized limitation copy directly in the Emergency card rather than hiding it behind a modal or tooltip. After the grid, render the localized House Shifting Services collaborative-attribution note; do not add a project card or ownership language.

- [ ] **Step 6: Reorganize skills, education, contact, and footer**

Replace developer-category cards with these three groups:

- Support and operations: Technical Support, PC Troubleshooting, Hardware, Software, Networking, File Management, Data Operations.
- Website and product support: WordPress, HTML/CSS, Browser Diagnostics, Bug Reproduction, REST API Awareness, SQL Awareness.
- Quality and communication: Documentation, GitHub, Postman, Jest, Accessibility, Client Communication, Developer Coordination.

Keep B.Sc., Diploma, IT Support Technician Levels 1 & 2, and SSC on the website. Keep only the B.Sc. GPA and SSC GPA; omit the Diploma GPA. Extend the contact profile strip with Availability and Location while keeping Languages and Interests. Preserve email, phone, WhatsApp, LinkedIn, and the working form.

In the footer, retain GitHub, LinkedIn, email, and phone, and add the already-verified Facebook profile from the existing structured data. Keep theme control in the navbar, where it currently belongs.

- [ ] **Step 7: Remove obsolete locale keys and run page/i18n tests**

After the view no longer references them, remove `nav.projects`, the entire `projects` object, `metrics.projects`, and developer-first skill labels. Keep key parity across all locale files.

Run:

```bash
npm test -- --runInBand tests/page.test.js tests/i18n.test.js
git diff --check
git status --short
```

Expected: both suites PASS; no stock image URLs, CGPA project, old Projects navigation, or developer-first professional positioning remain.

- [ ] **Step 8: Commit**

```bash
git add views/index.ejs views/partials/navbar.ejs views/partials/footer.ejs locales/en-US.json locales/bn.json locales/hi.json locales/ar.json locales/es.json locales/fr.json tests/page.test.js tests/i18n.test.js
git commit -m "feat: rebuild portfolio around technical support"
```

---

## Task 3: Add truthful evidence visuals and the approved visual system

**Files:**

- Add: `public/assets/evidence/noor-notes-library.png` (verbatim copy of the reviewed screenshot)
- Add: `public/assets/evidence/attendance-sync.svg`
- Add: `public/assets/evidence/emergency-supportability.svg`
- Modify: `views/index.ejs`
- Modify: `public/css/input.css`
- Regenerate: `public/css/output.css`
- Modify: `tests/page.test.js`

- [ ] **Step 1: Add failing asset and semantic-image tests**

Add assertions that all three evidence images are local, meaningful, and appropriate to their visibility boundary:

```js
it('uses local, truthful visuals for every evidence card', () => {
  const images = [...page.querySelectorAll('[data-evidence-card] img')];
  expect(images.map((image) => image.getAttribute('src'))).toEqual([
    '/assets/evidence/noor-notes-library.png',
    '/assets/evidence/attendance-sync.svg',
    '/assets/evidence/emergency-supportability.svg',
  ]);
  images.forEach((image) => {
    expect(image.getAttribute('alt').trim()).not.toBe('');
    expect(image.getAttribute('loading')).toBe('lazy');
  });
  expect(page.documentElement.innerHTML).not.toContain('images.unsplash.com');
});
```

Read the CSS and assert presence of `.hero-proof-grid`, `.approach-grid`, `.evidence-grid`, `.evidence-limitations`, and the mobile timeline rule.

- [ ] **Step 2: Run the page test and confirm failure**

Run:

```bash
npm test -- --runInBand tests/page.test.js
```

Expected: FAIL because the evidence assets and new layout rules are absent.

- [ ] **Step 3: Add only approved evidence assets**

- Copy `/home/mamun/Documents/noor-notes/data/screenshots/noor-notes-library.png` verbatim to `public/assets/evidence/noor-notes-library.png`. Do not edit or relabel it as another product.
- Create `attendance-sync.svg` as a neutral, redacted operational flow with only these labels: `Local record`, `Sync queue`, `Retry`, `Conflict log`, `Backup`, and `Export`. Include no names, timestamps tied to real people, IDs, spreadsheet URLs, employer identity, or screenshots from private data.
- Create `emergency-supportability.svg` as a review board with only these categories: `Roles & workflows`, `Validation & tests`, `Backup & export`, and `Remediation priorities`. Under remediation, show `CSRF`, `rate limits`, `security headers`, `cookies`, `validation`, and `uploads` as open work, not completed controls.
- Give both SVGs a descriptive `<title>` and `role="img"` where appropriate; the EJS `<img>` alt remains the primary accessible name.

- [ ] **Step 4: Implement the approved visual hierarchy**

In `public/css/input.css`, reuse existing variables where possible and implement:

- Dark navy hero and Experience sections.
- Warm off-white Capabilities, Approach, Evidence, Skills, Education, and Contact surfaces with alternating tint.
- Restrained teal/blue accents, visible focus states, and readable dark-mode equivalents.
- Tighter hero vertical spacing so proof metrics appear close to the fold.
- Four-column proof grid on desktop, two columns on tablets, one or two compact columns on mobile without overflow.
- Six-step Approach grid that becomes a readable single column on narrow screens.
- Three compact evidence cards with consistent aspect-ratio visual frames; Emergency limitations must remain visually prominent.
- A full-width mobile Experience timeline: remove decorative left gutter/offset below the existing mobile breakpoint and let `.timeline-content` use available width.
- Logical properties for RTL-sensitive spacing and alignment.
- Existing reduced-motion behavior; never make information depend on animation.

Avoid introducing a second visual framework or JavaScript layout dependency.

- [ ] **Step 5: Build CSS and run focused verification**

Run:

```bash
npm run build:css
npm test -- --runInBand tests/page.test.js
git diff --check
```

Expected: CSS builds; page, asset, accessibility, RTL, and no-stock-image tests PASS.

- [ ] **Step 6: Commit**

```bash
git add public/assets/evidence/noor-notes-library.png public/assets/evidence/attendance-sync.svg public/assets/evidence/emergency-supportability.svg views/index.ejs public/css/input.css public/css/output.css tests/page.test.js
git commit -m "feat: add support evidence visuals and layout"
```

---

## Task 4: Align active navigation and progressive interactions with the new sections

**Files:**

- Modify: `tests/frontend.test.js`
- Modify: `public/js/script.js`

- [ ] **Step 1: Add failing navigation-mapping tests**

Export a pure `getNavigationSection` helper and test the intended grouping:

```js
it('maps supporting sections to the closest navigation item', () => {
  expect(portfolio.getNavigationSection('home')).toBe('home');
  expect(portfolio.getNavigationSection('capabilities')).toBe('home');
  expect(portfolio.getNavigationSection('experience')).toBe('experience');
  expect(portfolio.getNavigationSection('approach')).toBe('approach');
  expect(portfolio.getNavigationSection('evidence')).toBe('evidence');
  expect(portfolio.getNavigationSection('skills')).toBe('skills');
  expect(portfolio.getNavigationSection('education')).toBe('skills');
  expect(portfolio.getNavigationSection('contact')).toBe('contact');
});
```

Keep all current theme, favicon, locale parsing, menu focus, Escape, validation, and active-state tests.

- [ ] **Step 2: Run the focused test and confirm failure**

Run:

```bash
npm test -- --runInBand tests/frontend.test.js
```

Expected: FAIL because `getNavigationSection` is not exported.

- [ ] **Step 3: Implement the pure mapping and reuse it**

Add:

```js
const getNavigationSection = (sectionId) => ({
  capabilities: 'home',
  education: 'skills',
}[sectionId] || sectionId);
```

Use it inside `initScrollNavigation`, export it from the module, and remove the inline `sectionMap`. Approach and Evidence should activate themselves. Preserve smooth scrolling, reduced-motion handling, focus restoration, and contact behavior.

- [ ] **Step 4: Run tests and commit**

Run:

```bash
npm test -- --runInBand tests/frontend.test.js tests/page.test.js
git diff --check
git add public/js/script.js tests/frontend.test.js
git commit -m "fix: align navigation with support sections"
```

Expected: both suites PASS.

---

## Task 5: Rewrite and verify the English support-engineer resume

**Files:**

- Add: `tests/resume.test.js`
- Modify: `public/resume.html`
- Modify only if tagging verification requires it: `scripts/generate-pdf.js`
- Regenerate: `public/Abdullah Al Mamun Resume.pdf`

- [ ] **Step 1: Add failing source-level resume tests**

Create `tests/resume.test.js` to read `public/resume.html` and parse it with jsdom:

```js
/** @jest-environment jsdom */

const fs = require('fs');
const path = require('path');

const resumeSource = fs.readFileSync(
  path.join(__dirname, '..', 'public', 'resume.html'),
  'utf8'
);
const resume = new DOMParser().parseFromString(resumeSource, 'text/html');

describe('English resume', () => {
  it('uses support-only positioning and evidence-backed claims', () => {
    const text = resume.body.textContent.replace(/\s+/g, ' ');
    expect(text).toContain('Technical Support Engineer');
    expect(text).not.toMatch(/50\+ workstations/i);
    expect(text).toContain('Installed and maintained workplace hardware and software.');
    expect(text).toContain('Open to remote opportunities');
    expect(text).not.toMatch(/Web Developer|Full[- ]Stack Developer/i);
    expect(text).not.toMatch(/improved support team response|improved .*%|reduced .*%|24\/7|minimized downtime|optimized outcomes/i);
    expect(text).not.toContain('PCIU CGPA Calculator');
  });

  it('keeps recruiter-relevant education and accurate project attribution', () => {
    const text = resume.body.textContent.replace(/\s+/g, ' ');
    expect(text).toContain('B.Sc. in Computer Science Engineering');
    expect(text).toContain('GPA 3.76 / 4.00');
    expect(text).toContain('Diploma in Engineering, Computer Technology');
    expect(text).toContain('IT Support Technician, Levels 1 & 2');
    expect(text).not.toContain('GPA 2.62');
    expect(text).not.toContain('S.S.C.');
    expect(text).toContain('Private case study');
    expect(text).toContain('not deployment-ready');
  });

  it('keeps contact and professional profile links clickable', () => {
    const hrefs = [...resume.querySelectorAll('a')].map((link) => link.href);
    expect(hrefs.some((href) => href.startsWith('mailto:'))).toBe(true);
    expect(hrefs.some((href) => href.includes('linkedin.com'))).toBe(true);
    expect(hrefs.some((href) => href.includes('github.com/saamaamr'))).toBe(true);
    expect(hrefs.some((href) => href.includes('mamunsandwipi.vercel.app'))).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test and confirm failure**

Run:

```bash
npm test -- --runInBand tests/resume.test.js
```

Expected: FAIL because the current summary says Web Developer/full-stack, contains unsupported outcomes, includes Diploma GPA and SSC, and lacks the new evidence framing.

- [ ] **Step 3: Rewrite the resume content without inventing facts**

Keep the name, Technical Support Engineer title, location, email, phone, GitHub, LinkedIn, and portfolio links. Use this summary:

> Technical Support Engineer with 7+ years in technology across software, travel operations, and financial services. Experienced in diagnosing hardware, software, website, access, and workflow issues; reproducing and documenting defects; maintaining WordPress and HTML/CSS websites; and coordinating clear resolutions between users, clients, and technical teams. Created practical troubleshooting documentation. Open to Technical Support and remote opportunities.

Use present tense for Bit Apps and past tense for the other two roles. Remove unsupported outcome statements including improved response times, optimized results, guaranteed availability, or minimized downtime.

Organize the resume as two A4 pages in this reading order:

1. Name, role, location, contact links.
2. Professional Summary.
3. Work Experience: Bit Apps, Kurnia Holiday Travels, Century Securities Limited.
4. Technical Support Skills using the same three outcome groups as the site.
5. Technical Support Evidence: concise Noor Notes, redacted Smart Attendance Tracker, and Emergency Medicine Finder entries.
6. Education and certification: B.Sc. with GPA, Diploma without GPA, and IT Support Technician Levels 1 & 2. Omit SSC.
7. Languages: Bangla — Fluent; English — Good.

For evidence text:

- Noor Notes: describe it as original authored work and link the public repository.
- Smart Attendance Tracker: label `Private case study`; do not include a repository link or employer details.
- Emergency Medicine Finder: use `production-grade feature scope` and explicitly say `not deployment-ready while documented security remediation remains`.
- Do not include House Shifting Services unless a one-line collaborative attribution fits without displacing support evidence; if included, say it is collaborative and do not imply sole authorship.

Keep HTML semantics (`h1`–`h3`, paragraphs, lists, and anchors) in ATS reading order. Avoid text embedded in images. Keep print styles deterministic and do not depend on the network-loaded font; system font fallback must remain acceptable.

- [ ] **Step 4: Run source tests and regenerate the PDF**

Run:

```bash
npm test -- --runInBand tests/resume.test.js
npm run generate-pdf
pdfinfo "public/Abdullah Al Mamun Resume.pdf"
pdftotext -layout "public/Abdullah Al Mamun Resume.pdf" /tmp/abdullah-support-resume.txt
sed -n '1,260p' /tmp/abdullah-support-resume.txt
```

Expected:

- Resume test PASS.
- `pdfinfo` reports exactly 2 A4 pages.
- Extracted text begins with Abdullah's name and Technical Support Engineer, follows the intended section order, and contains no clipped/duplicated text.
- Extracted text contains no Web Developer, Full-Stack Developer, unsupported percentages, `GPA 2.62`, SSC, or PCIU project reference.

If the existing generator does not produce a tagged PDF, add `tagged: true` to the `page.pdf({...})` options in `scripts/generate-pdf.js`, then verify `pdfinfo` reports `Tagged: yes`. Do not change margins until the two-page layout has been visually checked.

- [ ] **Step 5: Verify clickable annotations and commit**

Run:

```bash
pdfinfo -url "public/Abdullah Al Mamun Resume.pdf"
git diff --check
git status --short
git add public/resume.html "public/Abdullah Al Mamun Resume.pdf" tests/resume.test.js
git add scripts/generate-pdf.js
git commit -m "feat: rewrite resume for technical support roles"
```

Before committing, omit `scripts/generate-pdf.js` from staging if it did not require a change. Expected: PDF URL output includes the portfolio, GitHub, and LinkedIn links; only intended resume/test files are staged.

---

## Task 6: Perform full regression, accessibility, and responsive verification

**Files:**

- Modify if a discovered regression requires it: `tests/page.test.js`, `tests/frontend.test.js`, `tests/i18n.test.js`, `tests/resume.test.js`, relevant implementation file
- Modify: `README.md` only if it still describes the site as developer-first or lists obsolete projects

- [ ] **Step 1: Run the complete automated suite**

Run:

```bash
npm run build:css
npm test -- --runInBand
git diff --check
```

Expected: all tests PASS, including application routes, contact behavior/rate limiting, page accessibility, all locale dictionaries, frontend interactions, and resume integrity.

- [ ] **Step 2: Start the production server for browser checks**

Run:

```bash
npm start
```

Use the printed local URL. Check at minimum:

- English desktop at 1440×900 in light and dark themes.
- English mobile at 390×844.
- Bangla mobile at 390×844.
- Arabic desktop and mobile in RTL.
- One additional long-word locale, French or Spanish, at 768px width.

- [ ] **Step 3: Verify behavior and layout manually**

Confirm:

- A recruiter sees `Technical Support Engineer`, the support headline, current availability, and proof metrics without excessive empty hero space.
- Navigation highlighting follows Summary → Experience → Approach → Evidence → Skills → Contact.
- Locale and mobile menus work by pointer and keyboard, Escape restores focus, and theme choice persists.
- No horizontal overflow appears at any tested width.
- Mobile Experience cards use full practical width and do not retain a large timeline gutter.
- All three evidence visuals load; Noor is authentic, attendance is redacted, Emergency limitations are visible.
- The private card has no link and exposes no confidential details.
- Arabic ordering/alignment is correct and focus outlines remain visible.
- Reduced-motion mode reveals all content and disables nonessential animation.
- Resume buttons download the English PDF and non-English labels communicate that fact.
- Email, phone, WhatsApp, LinkedIn, GitHub, Facebook, evidence repository links, and hero/contact anchors target the intended destinations.
- Contact validation announces field errors and form status without changing the existing API contract.

- [ ] **Step 4: Audit final rendered claims**

Search authored and generated text:

```bash
rg -n -i "web developer|full[- ]stack developer|deployment[- ]ready|production[- ]ready|PCIU CGPA|GPA 2\.62|24/7|improved [0-9]+%|reduced [0-9]+%" views locales public/resume.html README.md
rg -n -i "attendance.*github|github.*attendance|spreadsheet.*https?://" views locales public/resume.html
rg -n "production-grade feature scope|Open to remote opportunities|Portfolio languages|collaborative work" views locales public/resume.html
```

Expected:

- First search returns no prohibited claims. The allowed phrase `not presented as deployment-ready` will match `deployment-ready`; manually confirm every occurrence is a negated limitation, never a readiness claim.
- Second search returns no private URL or spreadsheet identifier.
- Third search confirms the required truthful qualifiers are present in English source content.

- [ ] **Step 5: Update documentation only where stale**

If `README.md` names the removed Projects section or positions the portfolio as a development showcase, revise it to list the support-first sections, six locales, evidence policy, current test/build commands, and English resume PDF. Do not add marketing claims.

- [ ] **Step 6: Re-run final verification and commit any QA fixes**

Run:

```bash
npm run build:css
npm test -- --runInBand
npm run generate-pdf
pdfinfo "public/Abdullah Al Mamun Resume.pdf"
git diff --check
git status --short
```

Expected: all tests PASS, PDF remains exactly two A4 pages, no whitespace errors, and `logs/combined.log` remains unstaged.

If QA or README changes were required:

```bash
git add README.md tests/page.test.js tests/frontend.test.js tests/i18n.test.js tests/resume.test.js views/index.ejs views/partials/navbar.ejs views/partials/footer.ejs public/css/input.css public/css/output.css public/js/script.js locales/en-US.json locales/bn.json locales/hi.json locales/ar.json locales/es.json locales/fr.json scripts/generate-pdf.js public/resume.html "public/Abdullah Al Mamun Resume.pdf"
git commit -m "test: verify support portfolio experience"
```

Do not make an empty commit. Before completing the work, inspect `git status --short` and confirm the only remaining pre-existing change is `logs/combined.log`.

---

## Completion Criteria

- All six locale routes present Abdullah as a Technical Support Engineer within the hero.
- The page follows the approved eight-section order and keeps the current contact system.
- Only verified metrics render; the six-language number refers to the portfolio.
- Evidence attribution and privacy boundaries match the repository review.
- The site and resume contain no developer-first positioning, invented outcomes, unsupported tooling, or false deployment-readiness language.
- Existing theme, locale, mobile navigation, active navigation, accessibility, contact form, and route behavior still pass automated and browser checks.
- The English resume is a readable, clickable, tagged two-page A4 PDF with sensible ATS extraction.
- The worktree contains no accidental changes or staged runtime logs.
