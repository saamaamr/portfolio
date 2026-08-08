# Professional Profile Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Professionalize the hero's GitHub copy, expose Abdullah Al Mamun's Facebook profile in the hero, and add a direct Facebook Messenger contact action.

**Architecture:** Keep the existing server-rendered EJS structures and styling. Replace the GitHub card's locale interface and rendered copy, add one Facebook profile anchor to the existing hero-social group, add one Messenger anchor to the existing contact panel, enforce their exact link contracts through Jest, translate the new content across all six locale files, and align current documentation.

**Tech Stack:** Node.js, Express, EJS, JSON locale dictionaries, Jest, jsdom, Tailwind CSS CLI.

## Global Constraints

- Render the English card hierarchy exactly as `GitHub`, `Projects and contributions`, and `Explore my work ↗`.
- Use the English accessible label `Explore Abdullah Al Mamun's projects and contributions on GitHub`.
- Keep `href="https://github.com/saamaamr"`, `target="_blank"`, and `rel="noopener noreferrer"` unchanged.
- Keep `class="metric metric-link reveal"`, `data-metric="github-history"`, and `data-github-history` unchanged.
- Replace `metrics.repositorySince`, `metrics.repositoryHistory`, `metrics.githubProfile`, and `metrics.githubProfileLabel` with `metrics.githubTitle`, `metrics.githubDescription`, `metrics.githubAction`, and `metrics.githubWorkLabel` in every locale.
- Add a hero Facebook link to `https://www.facebook.com/saamaamr1` after LinkedIn.
- Add a Direct contact Facebook Messenger link to `https://m.me/saamaamr1` after LinkedIn.
- Give both Facebook links `target="_blank"` and `rel="noopener noreferrer"`.
- Add `contact.facebookMessage` to every locale with the exact approved translations.
- Keep all six locale dictionaries key-identical.
- Keep the existing footer Facebook link and Person structured-data URL unchanged.
- Do not change card styling, project cards, the contact form, navigation, the résumé, other GitHub links, or unrelated hero metrics.
- Preserve the user's existing `logs/combined.log` change and do not stage it.

---

### Task 1: Localized GitHub and Facebook Link Contract

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
- Produces: the locale keys `metrics.githubTitle`, `metrics.githubDescription`, `metrics.githubAction`, `metrics.githubWorkLabel`, and `contact.facebookMessage`; the rendered GitHub card; the hero Facebook profile anchor; and the Direct contact Messenger anchor.

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

In the same test, add the hero-profile link contract:

```js
const facebookProfile = page.querySelector(
  '.hero-socials a[href="https://www.facebook.com/saamaamr1"]'
);
expect(facebookProfile).not.toBeNull();
expect(facebookProfile.getAttribute('target')).toBe('_blank');
expect(facebookProfile.getAttribute('rel')).toBe('noopener noreferrer');
expect(facebookProfile.textContent.trim()).toBe('Facebook');
```

In the existing `keeps localized dates, recruiter-focused education, and current contact methods` test, add:

```js
const facebookMessage = page.querySelector(
  '.contact-panel a[href="https://m.me/saamaamr1"]'
);
expect(facebookMessage).not.toBeNull();
expect(facebookMessage.getAttribute('target')).toBe('_blank');
expect(facebookMessage.getAttribute('rel')).toBe('noopener noreferrer');
expect(facebookMessage.textContent).toContain('Facebook Messenger');
expect(facebookMessage.textContent).toContain('Send a message');
```

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
expect(english).toHaveProperty('contact.facebookMessage', 'Send a message');
```

Keep the existing parameterized test that requires Bangla, Hindi, Arabic, Spanish, and French to match the English key contract.

- [ ] **Step 3: Run the focused tests and verify the expected failure**

Run:

```bash
npm test -- --runInBand tests/page.test.js tests/i18n.test.js
```

Expected: FAIL because the template and dictionaries still expose repository-history keys, render the old GitHub wording, omit the hero Facebook link, omit the Messenger contact link, and omit `contact.facebookMessage`.

- [ ] **Step 4: Replace the GitHub locale interface and add the Facebook links**

In `views/index.ejs`, keep the anchor attributes unchanged and replace its localized children and accessible label with:

```ejs
<a href="https://github.com/saamaamr" target="_blank" rel="noopener noreferrer" class="metric metric-link reveal" data-metric="github-history" data-github-history aria-label="<%= t('metrics.githubWorkLabel') %>"><strong><%= t('metrics.githubTitle') %></strong><span><%= t('metrics.githubDescription') %></span><small><%= t('metrics.githubAction') %> <span aria-hidden="true">↗</span></small></a>
```

In `.hero-socials`, insert this anchor immediately after LinkedIn:

```ejs
<a href="https://www.facebook.com/saamaamr1" target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook-f" aria-hidden="true"></i> Facebook</a>
```

In `.contact-panel`, insert this row immediately after LinkedIn:

```ejs
<a href="https://m.me/saamaamr1" target="_blank" rel="noopener noreferrer"><span class="icon-tile"><i class="fab fa-facebook-messenger" aria-hidden="true"></i></span><span><small>Facebook Messenger</small><strong><%= t('contact.facebookMessage') %></strong></span></a>
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

Add `contact.facebookMessage` to the existing `contact` object in every locale with these exact values:

```text
en-US=Send a message
bn=বার্তা পাঠান
hi=संदेश भेजें
ar=إرسال رسالة
es=Enviar un mensaje
fr=Envoyer un message
```

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
git commit -m "feat: refine professional profile links"
```

Before committing, confirm `logs/combined.log` is not staged.

### Task 2: Documentation Alignment and Full Verification

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/specs/2026-08-08-github-history-metric-design.md`
- Modify: `docs/superpowers/plans/2026-08-08-github-history-metric.md`
- Modify: `docs/superpowers/plans/2026-08-08-professional-github-card.md`

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
rg -n "repositorySince|repositoryHistory|githubProfileLabel|Since 2022|Public repository history" views locales README.md --glob '!*.pdf'
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
git add README.md docs/superpowers/specs/2026-08-08-github-history-metric-design.md docs/superpowers/plans/2026-08-08-github-history-metric.md docs/superpowers/plans/2026-08-08-professional-github-card.md
git commit -m "docs: align GitHub card wording"
```

Confirm `logs/combined.log` remains unstaged after the commit.

### Task 3: Publish Verified Commits

**Files:**
- No source files modified.

**Interfaces:**
- Consumes: the verified commits from Tasks 1 and 2 plus the previously committed design and plan documents.
- Produces: `origin/main` pointing at the same commit as local `main`.

- [ ] **Step 1: Confirm the publish boundary**

Run:

```bash
git branch --show-current
git status --short
git log -6 --oneline --decorate
```

Expected: the branch is `main`; the implementation, documentation, design, and plan commits are present; and `logs/combined.log` is the only uncommitted file.

- [ ] **Step 2: Push local main**

Run:

```bash
git push origin main
```

Expected: Git reports that `main` was updated on `origin` without a non-fast-forward rejection.

- [ ] **Step 3: Verify the remote commit**

Run:

```bash
git rev-parse HEAD
git rev-parse origin/main
git status --short
```

Expected: the two commit hashes are identical and `logs/combined.log` remains the only uncommitted file.
