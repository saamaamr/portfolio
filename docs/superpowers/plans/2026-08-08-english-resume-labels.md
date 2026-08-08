# English Resume Labels Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render “Resume” and “Download Resume” on every English portfolio Resume action without changing other languages or link behavior.

**Architecture:** Keep presentation templates unchanged and correct the source copy in the American English dictionary. Extend the server-rendered page regression test to validate all three English Resume links and reject the accented spelling.

**Tech Stack:** JSON locale dictionaries, EJS, Jest, jsdom

## Global Constraints

- Change only `nav.resume`, `nav.downloadResume`, and `hero.downloadResume` in `locales/en-US.json`.
- Do not modify non-English dictionaries, templates, styling, routes, or the Resume PDF filename.
- All three links must continue targeting `/Abdullah Al Mamun Resume.pdf`.
- Preserve `logs/combined.log` unstaged.

---

### Task 1: Correct and protect English Resume labels

**Files:**
- Modify: `tests/page.test.js`
- Modify: `locales/en-US.json`
- Create: `docs/superpowers/plans/2026-08-08-english-resume-labels.md`

**Interfaces:**
- Consumes: `buildPageContext('en-US')`, `views/index.ejs`, and the existing `/Abdullah Al Mamun Resume.pdf` link contract.
- Produces: English server-rendered link labels `Resume`, `Download Resume`, and `Download Resume` in document order.

- [ ] **Step 1: Add a failing page regression assertion**

Extend the existing `presents a stable support-focused hero and primary resume action` test with:

```js
const resumeLinks = [...page.querySelectorAll('a[href="/Abdullah Al Mamun Resume.pdf"]')];

expect(resumeLinks.map((link) => link.textContent.trim())).toEqual([
  'Resume',
  'Download Resume',
  'Download Resume',
]);
expect(page.body.textContent).not.toMatch(/Résumé|résumé/);
```

- [ ] **Step 2: Run the focused test and verify the current copy fails**

Run:

```bash
npm test -- --runInBand tests/page.test.js
```

Expected: FAIL because the rendered labels are `Résumé` and `Download résumé`.

- [ ] **Step 3: Correct the three American English dictionary values**

Apply exactly these values in `locales/en-US.json`:

```json
"resume": "Resume",
"downloadResume": "Download Resume"
```

Use `Download Resume` for both the `nav.downloadResume` and `hero.downloadResume` keys.

- [ ] **Step 4: Run focused and full verification**

Run:

```bash
npm test -- --runInBand tests/page.test.js
npm test -- --runInBand
node -e "const fs=require('fs'); for(const file of fs.readdirSync('locales')) JSON.parse(fs.readFileSync('locales/'+file,'utf8')); console.log('Locale JSON valid')"
git diff --check
```

Expected: the page suite and all 61 tests pass, every locale JSON file parses, and the diff check exits successfully.

- [ ] **Step 5: Commit only the copy correction, regression test, and plan**

Run:

```bash
git add locales/en-US.json tests/page.test.js docs/superpowers/plans/2026-08-08-english-resume-labels.md
git commit -m "fix: use Resume spelling in English actions"
```

Expected: the commit contains exactly those three files; `logs/combined.log` remains modified and unstaged.
