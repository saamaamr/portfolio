# Professional README Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a professional hybrid README that explains the portfolio clearly to recruiters while giving developers complete setup, architecture, localization, verification, API, and deployment guidance.

**Architecture:** This is a documentation-only update centered on `README.md`. Repository configuration, locale files, routes, tests, and deployment files are authoritative sources; the README summarizes them without changing application behavior.

**Tech Stack:** Markdown, Node.js, Express, EJS, Tailwind CSS, Jest, Supertest, jsdom, jest-axe, Puppeteer Core, Vercel

## Global Constraints

- Keep the document concise and factual; do not use decorative or externally hosted status badges.
- Do not claim functionality beyond what the repository and completed verification demonstrate.
- Preserve SMTP safety guidance and do not expose credentials.
- Use tables only for language routes and commands.
- Do not add images, dependencies, application code, or deployment changes.
- Preserve the unrelated local modification to `logs/combined.log` and never stage it.

---

### Task 1: Rewrite and verify the professional README

**Files:**
- Modify: `README.md`
- Reference: `package.json`
- Reference: `.env.example`
- Reference: `utils/i18n.js`
- Reference: `public/sitemap.xml`
- Reference: `swagger.json`
- Reference: `vercel.json`

**Interfaces:**
- Consumes: the production URL, npm scripts, environment-variable names, locale definitions, public locale routes, contact schema, and Vercel configuration already present in the repository.
- Produces: one self-contained Markdown entry point for recruiters, maintainers, and contributors.

- [ ] **Step 1: Audit every factual source used by the README**

Run:

```bash
sed -n '1,240p' package.json
sed -n '1,200p' .env.example
sed -n '1,180p' utils/i18n.js
sed -n '1,180p' public/sitemap.xml
sed -n '1,260p' swagger.json
sed -n '1,160p' vercel.json
```

Expected: commands, locale routes, environment variables, contact limits, and deployment behavior can be cited directly from repository files.

- [ ] **Step 2: Replace `README.md` with the approved hybrid structure**

Write these sections in order:

```text
Title and positioning
Live Portfolio
Highlights
Languages
Technology
How It Works
Local Development
Environment Variables
Commands
Project Structure
Contact API
Quality and Verification
Deployment
Translation Maintenance
Contributing
License
```

The Languages table must contain exactly:

```text
American English | /   | en-US | LTR | Default
Bangla           | /bn | bn    | LTR | Translated
Hindi            | /hi | hi    | LTR | Translated
Arabic           | /ar | ar    | RTL | Translated
Spanish          | /es | es    | LTR | Translated
French           | /fr | fr    | LTR | Translated
```

The Quality and Verification section must report only the latest verified results:

```text
61 automated tests across 8 suites
12 browser combinations covering 6 locales at desktop and mobile widths
0 high-severity npm audit findings; latest full audit found 0 vulnerabilities
Successful production CSS build
Accessibility coverage with jest-axe and keyboard interaction tests
```

- [ ] **Step 3: Check documentation consistency**

Run:

```bash
node -e "const p=require('./package.json'); console.log(Object.keys(p.scripts).sort().join('\n'))"
node -e "const {SUPPORTED_LOCALES}=require('./utils/i18n'); console.log(SUPPORTED_LOCALES.map(({code,path,dir})=>[code,path,dir].join(' ')).join('\n'))"
git diff --check
```

Expected: every documented npm command and locale route matches repository output, and `git diff --check` exits successfully.

- [ ] **Step 4: Run fresh project verification**

Run:

```bash
npm run build:css
npm test -- --runInBand
npm audit --audit-level=high
```

Expected: the CSS build exits successfully, all 61 tests pass, and npm reports no vulnerabilities.

- [ ] **Step 5: Review and commit only the documentation files**

Run:

```bash
git diff -- README.md
git status --short
git add README.md docs/superpowers/plans/2026-08-08-professional-readme.md
git commit -m "docs: publish professional project readme"
```

Expected: the commit contains the rewritten README and this implementation plan; `logs/combined.log` remains modified but unstaged.
