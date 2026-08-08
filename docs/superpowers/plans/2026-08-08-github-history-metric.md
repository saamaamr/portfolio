# GitHub History Metric Implementation Plan

> **Superseded:** The hero-card wording and locale interface in this document were replaced by `2026-08-08-professional-github-card-design.md`. The historical GitHub audit remains decision context only.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the unsupported workstation count with a verifiable GitHub-history link, remove the numeric claim everywhere, and simplify the primary hero CTA.

**Architecture:** Keep the existing server-rendered EJS and JSON localization structure. Convert only the middle hero proof card into a static accessible anchor backed by the GitHub profile, preserve existing reveal behavior, and align the HTML/PDF résumé and public documentation with the same non-quantified experience wording.

**Tech Stack:** Node.js, Express, EJS, JSON locale dictionaries, CSS, Jest/jsdom/jest-axe, Puppeteer Core.

## Global Constraints

- Display `Since 2022` with the label `Public repository history`.
- Link the metric directly to `https://github.com/saamaamr` using `target="_blank"` and `rel="noopener noreferrer"`.
- Do not claim continuous GitHub activity, commit totals, sole authorship, or ownership of collaborative repositories.
- Replace `View support experience` with `View experience`; keep the destination `#experience`.
- Remove `50+ workstations` and localized equivalents from rendered content, résumé, current tests, README, and portfolio planning/specification documents.
- Preserve the underlying experience as `Installed and maintained workplace hardware and software.`
- Keep all six locale dictionaries key-identical.
- Do not add dependencies or change unrelated sections.

---

### Task 1: Hero history link, CTA, and localized experience copy

**Files:**
- Modify: `tests/page.test.js`
- Modify: `tests/i18n.test.js`
- Modify: `views/index.ejs`
- Modify: `public/css/input.css`
- Modify: `locales/en-US.json`
- Modify: `locales/bn.json`
- Modify: `locales/hi.json`
- Modify: `locales/ar.json`
- Modify: `locales/es.json`
- Modify: `locales/fr.json`

**Interfaces:**
- Consumes: `buildPageContext(locale)` and the existing `t(key)` EJS helper.
- Produces: `data-metric="github-history"`, `data-github-history`, and locale keys `metrics.repositorySince`, `metrics.repositoryHistory`, and `metrics.githubProfile`.

- [ ] **Step 1: Write the failing hero and locale tests**

Update `tests/page.test.js` to require the new metric, link contract, CTA copy, and removed claim:

```js
expect(page.querySelector('[data-primary-cta]').textContent.trim()).toContain('View experience');
expect([...page.querySelectorAll('[data-metric]')].map((node) => node.dataset.metric)).toEqual([
  'years',
  'github-history',
  'industries',
]);
expect([...page.querySelectorAll('[data-metric] strong')].map((node) =>
  node.textContent.trim()
)).toEqual(['7+', 'Since 2022', '3']);
const githubHistory = page.querySelector('[data-github-history]');
expect(githubHistory.getAttribute('href')).toBe('https://github.com/saamaamr');
expect(githubHistory.getAttribute('target')).toBe('_blank');
expect(githubHistory.getAttribute('rel')).toBe('noopener noreferrer');
expect(githubHistory.textContent).toContain('Public repository history');
expect(githubHistory.textContent).toContain('View GitHub profile');
expect(page.body.textContent).not.toMatch(/50\+ workstations/i);
```

Update `tests/i18n.test.js` to require:

```js
expect(english.hero.primaryAction).toBe('View experience');
expect(english.metrics).toMatchObject({
  years: 'Years in technology',
  repositorySince: 'Since 2022',
  repositoryHistory: 'Public repository history',
  githubProfile: 'View GitHub profile',
  industries: 'Industries supported',
});
expect(english).not.toHaveProperty('metrics.workstations');
expect(english.experience.juniorBullet1).toBe(
  'Installed and maintained workplace hardware and software.'
);
```

- [ ] **Step 2: Run focused tests and verify the expected failure**

Run: `npm test -- --runInBand tests/page.test.js tests/i18n.test.js`

Expected: FAIL because `workstations`, `50+`, and `View support experience` still render and the new history keys/link do not exist.

- [ ] **Step 3: Implement the localized metric, CTA, and experience wording**

Replace the middle metric in `views/index.ejs` with:

```ejs
<a href="https://github.com/saamaamr" target="_blank" rel="noopener noreferrer" class="metric metric-link reveal" data-metric="github-history" data-github-history aria-label="<%= t('metrics.githubProfileLabel') %>">
  <strong><%= t('metrics.repositorySince') %></strong>
  <span><%= t('metrics.repositoryHistory') %></span>
  <small><%= t('metrics.githubProfile') %> <span aria-hidden="true">↗</span></small>
</a>
```

For English, use:

```json
"primaryAction": "View experience",
"metrics": {
  "years": "Years in technology",
  "repositorySince": "Since 2022",
  "repositoryHistory": "Public repository history",
  "githubProfile": "View GitHub profile",
  "githubProfileLabel": "Public repository history since 2022 — view GitHub profile",
  "industries": "Industries supported"
},
"juniorBullet1": "Installed and maintained workplace hardware and software."
```

Use equivalent native translations in Bangla, Hindi, Arabic, Spanish, and French. Remove `metrics.workstations` and replace every localized numeric Century Securities bullet with the non-quantified wording.

Add scoped `.metric-link` rules in `public/css/input.css` for text alignment, the small profile-link line, hover border/background, and inherited visible focus. Do not alter global link or metric styles.

- [ ] **Step 4: Run focused tests and build CSS**

Run: `npm test -- --runInBand tests/page.test.js tests/i18n.test.js`

Expected: PASS.

Run: `npm run build:css`

Expected: exit 0.

- [ ] **Step 5: Commit the website change**

```bash
git add tests/page.test.js tests/i18n.test.js views/index.ejs public/css/input.css locales/en-US.json locales/bn.json locales/hi.json locales/ar.json locales/es.json locales/fr.json
git commit -m "feat: reference verified GitHub history"
```

### Task 2: Résumé claim removal and PDF regeneration

**Files:**
- Modify: `tests/resume.test.js`
- Modify: `public/resume.html`
- Modify: `public/Abdullah Al Mamun Resume.pdf`

**Interfaces:**
- Consumes: static `public/resume.html` parsed by jsdom and rendered by `scripts/generate-pdf.js`.
- Produces: a two-page tagged A4 PDF without the workstation count and with the existing GitHub profile link.

- [ ] **Step 1: Write the failing résumé test**

Replace the positive `50+ workstations` assertion with:

```js
expect(text).not.toMatch(/50\+ workstations/i);
expect(text).toContain('Installed and maintained workplace hardware and software.');
expect(resume.querySelector('a[href="https://github.com/saamaamr"]')).not.toBeNull();
```

- [ ] **Step 2: Run the résumé test and verify the expected failure**

Run: `npm test -- --runInBand tests/resume.test.js`

Expected: FAIL because the HTML résumé still includes the workstation count.

- [ ] **Step 3: Update résumé wording**

In `public/resume.html`, remove `Supported hardware and software across 50+ workstations and` from the summary and retain `Created practical troubleshooting documentation.` as its own supported statement. Replace the Century Securities bullet with:

```html
<li>Installed and maintained workplace hardware and software.</li>
```

Keep the existing contact-area GitHub profile anchor unchanged.

- [ ] **Step 4: Verify HTML and regenerate the PDF**

Run: `npm test -- --runInBand tests/resume.test.js`

Expected: PASS.

Run: `npm run generate-pdf`

Expected: `PDF generated: .../public/Abdullah Al Mamun Resume.pdf`.

Run:

```bash
pdfinfo "public/Abdullah Al Mamun Resume.pdf"
pdfinfo -url "public/Abdullah Al Mamun Resume.pdf"
pdftotext "public/Abdullah Al Mamun Resume.pdf" -
```

Expected: two A4 tagged pages, a clickable `https://github.com/saamaamr` annotation, `Installed and maintained workplace hardware and software.`, and no `50+ workstations` text.

- [ ] **Step 5: Commit résumé alignment**

```bash
git add tests/resume.test.js public/resume.html "public/Abdullah Al Mamun Resume.pdf"
git commit -m "fix: remove unverified workstation count"
```

### Task 3: README and stale documentation alignment

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/specs/2026-08-08-professional-support-engineer-portfolio-design.md`
- Modify: `docs/superpowers/specs/2026-08-08-developer-evidence-design.md`
- Modify: `docs/superpowers/plans/2026-08-08-professional-support-engineer-portfolio.md`
- Modify: `docs/superpowers/plans/2026-08-08-developer-evidence.md`

**Interfaces:**
- Consumes: the implemented website and evidence set.
- Produces: public repository documentation that no longer calls the workstation count verified.

- [ ] **Step 1: Update README evidence and history statements**

Replace the outdated Evidence and Attribution bullets with:

```markdown
- Noor Notes, Emergency Medicine Finder, and House Shifting Services are the three primary public evidence repositories.
- PCIU CGPA Calculator is listed separately as a collaborative contribution.
- House Shifting Services and PCIU CGPA Calculator are not presented as independently built work.
- Emergency Medicine Finder keeps its documented deployment-readiness limitations visible.
- Public repository history is presented as beginning in 2022 and links to [the GitHub profile](https://github.com/saamaamr); it does not claim continuous activity or sole authorship.
- The portfolio does not use unverified workstation counts, percentages, performance outcomes, or unsupported availability claims.
```

- [ ] **Step 2: Replace stale metric references in prior specs and plans**

Change current requirements/examples from `50+ workstations`, `workstations`, or `metrics.workstations` to the approved `Since 2022`, `github-history`, and repository-history keys. Where the documents discuss the old decision historically, mark it superseded by `2026-08-08-github-history-metric-design.md` instead of calling it verified.

- [ ] **Step 3: Audit removed claims and current links**

Run:

```bash
rg -n -i "50\+|50 workstations|workstations supported|metrics\.workstations|data-metric=\"workstations\"" views public locales tests README.md docs/superpowers --glob '!*.pdf'
```

Expected: no matches except the new design document's explicit explanation of the removed claim, if retained for decision history.

Run:

```bash
rg -n "https://github.com/saamaamr" views/index.ejs public/resume.html README.md
```

Expected: the hero history metric, existing profile links, résumé profile link, and README evidence-source link are present.

- [ ] **Step 4: Run full verification**

Run: `npm test -- --runInBand`

Expected: all suites pass.

Run: `npm run build:css`

Expected: exit 0.

Run: `git diff --check`

Expected: no output and exit 0.

- [ ] **Step 5: Commit documentation alignment**

```bash
git add README.md docs/superpowers/specs/2026-08-08-professional-support-engineer-portfolio-design.md docs/superpowers/specs/2026-08-08-developer-evidence-design.md docs/superpowers/plans/2026-08-08-professional-support-engineer-portfolio.md docs/superpowers/plans/2026-08-08-developer-evidence.md
git commit -m "docs: align claims with GitHub history"
```
