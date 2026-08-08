# Professional GitHub Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero's audit-like repository-history copy with a professional invitation to explore Abdullah Al Mamun's GitHub projects and contributions.

**Architecture:** Keep the existing server-rendered EJS anchor, GitHub URL, card styling, animation, and link behavior. Replace only the card's locale interface and rendered copy, enforce the English contract and removed legacy wording through Jest, translate the new contract across all six locale files, and align current documentation.

**Tech Stack:** Node.js, Express, EJS, JSON locale dictionaries, Jest, jsdom, Tailwind CSS CLI.

## Global Constraints

- Render the English card hierarchy exactly as `GitHub`, `Projects and contributions`, and `Explore my work ↗`.
- Use the English accessible label `Explore Abdullah Al Mamun's projects and contributions on GitHub`.
- Keep `href="https://github.com/saamaamr"`, `target="_blank"`, and `rel="noopener noreferrer"` unchanged.
- Keep `class="metric metric-link reveal"`, `data-metric="github-history"`, and `data-github-history` unchanged.
- Replace `metrics.repositorySince`, `metrics.repositoryHistory`, `metrics.githubProfile`, and `metrics.githubProfileLabel` with `metrics.githubTitle`, `metrics.githubDescription`, `metrics.githubAction`, and `metrics.githubWorkLabel` in every locale.
- Keep all six locale dictionaries key-identical.
- Do not change card styling, project cards, other GitHub links, the résumé, or unrelated hero metrics.
- Preserve the user's existing `logs/combined.log` change and do not stage it.

---

### Task 1: Localized GitHub Card Contract

**Files:**
- Modify: `tests/page.test.js`
- Modify: `tests/i18n.test.js`
- Modify: `views/index.ejs`
- Modify: `locales/en-US.json`
- Modify: `locales/bn.json`
- Modify: `locales/hi.json`
- Modify: `locales/ar.json`
- Modify: `locales/es.json`
- Modify: `locales/fr.json`

**Interfaces:**
- Consumes: the existing `t(key)` EJS helper and `buildPageContext(locale)` locale loading behavior.
- Produces: the locale keys `metrics.githubTitle`, `metrics.githubDescription`, `metrics.githubAction`, and `metrics.githubWorkLabel`, rendered inside the existing `[data-github-history]` anchor.

- [ ] **Step 1: Write the failing page test**

In `tests/page.test.js`, replace the current GitHub-history assertions with:

```js
expect([...page.querySelectorAll('[data-metric] strong')].map((node) =>
  node.textContent.trim()
)).toEqual(['7+', 'GitHub', '3']);
const githubWork = page.querySelector('[data-github-history]');
expect(githubWork.getAttribute('href')).toBe('https://github.com/saamaamr');
expect(githubWork.getAttribute('target')).toBe('_blank');
expect(githubWork.getAttribute('rel')).toBe('noopener noreferrer');
expect(githubWork.getAttribute('aria-label')).toBe(
  "Explore Abdullah Al Mamun's projects and contributions on GitHub"
);
expect(githubWork.textContent).toContain('Projects and contributions');
expect(githubWork.textContent).toContain('Explore my work');
expect(githubWork.textContent).not.toContain('Since 2022');
expect(githubWork.textContent).not.toContain('Public repository history');
```

Keep the surrounding metric-order assertion and all unrelated page assertions unchanged.

- [ ] **Step 2: Write the failing locale-contract test**

In `tests/i18n.test.js`, replace the existing `english.metrics` GitHub-history properties with:

```js
expect(english.metrics).toMatchObject({
  years: 'Years in technology',
  githubTitle: 'GitHub',
  githubDescription: 'Projects and contributions',
  githubAction: 'Explore my work',
  githubWorkLabel: "Explore Abdullah Al Mamun's projects and contributions on GitHub",
  industries: 'Industries supported',
});
expect(english).not.toHaveProperty('metrics.repositorySince');
expect(english).not.toHaveProperty('metrics.repositoryHistory');
expect(english).not.toHaveProperty('metrics.githubProfile');
expect(english).not.toHaveProperty('metrics.githubProfileLabel');
```

Keep the existing parameterized test that requires Bangla, Hindi, Arabic, Spanish, and French to match the English key contract.

- [ ] **Step 3: Run the focused tests and verify the expected failure**

Run:

```bash
npm test -- --runInBand tests/page.test.js tests/i18n.test.js
```

Expected: FAIL because the template and dictionaries still expose repository-history keys and render `Since 2022`, `Public repository history`, and `View GitHub profile`.

- [ ] **Step 4: Replace the template's locale interface**

In `views/index.ejs`, keep the anchor attributes unchanged and replace its localized children and accessible label with:

```ejs
<a href="https://github.com/saamaamr" target="_blank" rel="noopener noreferrer" class="metric metric-link reveal" data-metric="github-history" data-github-history aria-label="<%= t('metrics.githubWorkLabel') %>"><strong><%= t('metrics.githubTitle') %></strong><span><%= t('metrics.githubDescription') %></span><small><%= t('metrics.githubAction') %> <span aria-hidden="true">↗</span></small></a>
```

- [ ] **Step 5: Replace the four metric keys in every locale**

Keep `years` and `industries` unchanged. Use these exact values for the four new keys:

```text
en-US
githubTitle=GitHub
githubDescription=Projects and contributions
githubAction=Explore my work
githubWorkLabel=Explore Abdullah Al Mamun's projects and contributions on GitHub

bn
githubTitle=GitHub
githubDescription=প্রজেক্ট ও অবদান
githubAction=আমার কাজ দেখুন
githubWorkLabel=GitHub-এ Abdullah Al Mamun-এর প্রজেক্ট ও অবদান দেখুন

hi
githubTitle=GitHub
githubDescription=प्रोजेक्ट और योगदान
githubAction=मेरा काम देखें
githubWorkLabel=GitHub पर Abdullah Al Mamun के प्रोजेक्ट और योगदान देखें

ar
githubTitle=GitHub
githubDescription=المشاريع والمساهمات
githubAction=استكشف أعمالي
githubWorkLabel=استكشف مشاريع ومساهمات Abdullah Al Mamun على GitHub

es
githubTitle=GitHub
githubDescription=Proyectos y contribuciones
githubAction=Explora mi trabajo
githubWorkLabel=Explora los proyectos y contribuciones de Abdullah Al Mamun en GitHub

fr
githubTitle=GitHub
githubDescription=Projets et contributions
githubAction=Découvrir mon travail
githubWorkLabel=Découvrez les projets et contributions d’Abdullah Al Mamun sur GitHub
```

Remove `repositorySince`, `repositoryHistory`, `githubProfile`, and `githubProfileLabel` from every locale rather than retaining aliases.

- [ ] **Step 6: Run focused tests and build CSS**

Run:

```bash
npm test -- --runInBand tests/page.test.js tests/i18n.test.js
npm run build:css
```

Expected: both focused Jest suites PASS, locale keys remain identical, and the CSS build exits 0 without requiring a source-style change.

- [ ] **Step 7: Commit the localized card change**

```bash
git add tests/page.test.js tests/i18n.test.js views/index.ejs locales/en-US.json locales/bn.json locales/hi.json locales/ar.json locales/es.json locales/fr.json
git commit -m "fix: professionalize GitHub portfolio card"
```

Before committing, confirm `logs/combined.log` is not staged.

### Task 2: Documentation Alignment and Full Verification

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/specs/2026-08-08-github-history-metric-design.md`
- Modify: `docs/superpowers/plans/2026-08-08-github-history-metric.md`

**Interfaces:**
- Consumes: the approved design at `docs/superpowers/specs/2026-08-08-professional-github-card-design.md` and the implemented locale contract from Task 1.
- Produces: the public README describing the GitHub card as a work-discovery link and the two GitHub-history documents clearly identifying their wording as superseded.

- [ ] **Step 1: Add the new public README wording**

In `README.md`, replace the repository-history evidence bullet with:

```markdown
- The hero links recruiters to [GitHub projects and contributions](https://github.com/saamaamr) without implying continuous activity, commit totals, or sole authorship.
```

- [ ] **Step 2: Mark the old GitHub-history design and plan as superseded**

Immediately below the title in both `docs/superpowers/specs/2026-08-08-github-history-metric-design.md` and `docs/superpowers/plans/2026-08-08-github-history-metric.md`, add:

```markdown
> **Superseded:** The hero-card wording and locale interface in this document were replaced by `2026-08-08-professional-github-card-design.md`. The historical GitHub audit remains decision context only.
```

- [ ] **Step 3: Audit source and current public copy**

Run:

```bash
rg -n "repositorySince|repositoryHistory|githubProfileLabel|Since 2022|Public repository history" views locales tests README.md --glob '!*.pdf'
```

Expected: no matches.

Run:

```bash
rg -n "githubTitle|githubDescription|githubAction|githubWorkLabel" views locales tests
```

Expected: the template, all six locale dictionaries, and the English contract test contain the new keys.

- [ ] **Step 4: Run full verification**

Run:

```bash
npm test -- --runInBand
npm run build:css
git diff --check
git status --short
```

Expected: all Jest suites PASS, CSS builds successfully, `git diff --check` emits no output, and the status contains only intended Task 2 files plus the pre-existing unstaged `logs/combined.log` change.

- [ ] **Step 5: Commit documentation alignment**

```bash
git add README.md docs/superpowers/specs/2026-08-08-github-history-metric-design.md docs/superpowers/plans/2026-08-08-github-history-metric.md
git commit -m "docs: align GitHub card wording"
```

Confirm `logs/combined.log` remains unstaged after the commit.
