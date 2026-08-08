# Universal Two-Page Résumé Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Abdullah Al Mamun's English résumé as a balanced, professional two-page document for broad technical-support and IT-operations roles.

**Architecture:** Keep the existing static `public/resume.html` to Puppeteer PDF pipeline. Redesign only the résumé source and its committed generated PDF, enforce the content and link contract through jsdom tests, and verify page count, tagging, link annotations, ATS extraction order, and rendered visual balance before publication.

**Tech Stack:** Semantic HTML, embedded print CSS, Jest with jsdom, Puppeteer Core with Google Chrome, Poppler `pdfinfo`/`pdftotext`/`pdftoppm`, Git.

## Global Constraints

- Keep exactly two tagged A4 pages using PDF 1.4.
- Use the headline `Technical Support & IT Operations Professional`; keep all employment titles unchanged.
- Use only facts already present in the approved design and current evidence; do not add outcomes, percentages, ticket volumes, SLAs, satisfaction scores, unsupported tools, or proficiency ratings.
- Preserve clickable email, phone, LinkedIn, GitHub, portfolio, Noor Notes, Emergency Medicine Finder, and House Shifting Services links.
- Do not add Facebook, Messenger, a photograph, icons, a QR code, tables, progress bars, ratings, or background graphics.
- Replace `Developer Evidence` with `Selected Technical Work` and remove PCIU CGPA Calculator from the résumé only.
- Keep the website, locale dictionaries, routes, contact form, and public evidence cards unchanged.
- Avoid `strong` and `aside` elements because they create invalid PDF 1.4 structure roles in the current Chrome pipeline.
- Preserve the user's existing unstaged `logs/combined.log` change and never stage it.

---

### Task 1: Résumé Content, Structure, and Print Layout

**Files:**
- Modify: `tests/resume.test.js`
- Modify: `public/resume.html`

**Interfaces:**
- Consumes: `public/resume.html` parsed by jsdom and the content contract in `docs/superpowers/specs/2026-08-08-universal-two-page-resume-design.md`.
- Produces: two semantic `article.page` elements, three `[data-core-competency]` groups, and three `[data-selected-work]` entries for the PDF generator.

- [ ] **Step 1: Rewrite the failing positioning and structure tests**

In `tests/resume.test.js`, replace the first test with:

```js
it('uses universal support positioning and evidence-backed claims', () => {
  const text = resume.body.textContent.replace(/\s+/g, ' ');
  const profile = resume.querySelector('#profile-title + .summary').textContent.trim();
  const pages = [...resume.querySelectorAll('article.page')];
  const competencies = [...resume.querySelectorAll('[data-core-competency]')];

  expect(pages).toHaveLength(2);
  expect(pages.map((page) => page.getAttribute('aria-label'))).toEqual([
    'Resume page 1',
    'Resume page 2',
  ]);
  expect(resume.querySelector('.role').textContent.trim()).toBe(
    'Technical Support & IT Operations Professional'
  );
  expect(profile).toBe(
    'Technical support and IT operations professional with 7+ years of experience across software, travel operations, and financial services. Skilled in end-user support, hardware and software troubleshooting, website maintenance, defect reproduction, documentation, and clear coordination between users, clients, and technical teams.'
  );
  expect(competencies).toHaveLength(3);
  expect(competencies.map((entry) => entry.querySelector('h3').textContent.trim())).toEqual([
    'End-user support',
    'Website support',
    'Communication & quality',
  ]);
  expect(text).toContain('Installed and maintained workplace hardware and software.');
  expect(text).toContain('Open to Technical Support, IT Support, and remote opportunities');
  expect(text).not.toMatch(/50\+ workstations|24\/7|improved .*%|reduced .*%/i);
  expect(text).not.toMatch(/Web Developer|Full[- ]Stack Developer/i);
});
```

This catches a regression to the narrow headline, long profile, missing competency groups, unsupported results, or a one-page/three-page structure.

- [ ] **Step 2: Rewrite the selected-work test**

Replace the current developer-evidence tests with:

```js
it('presents three curated technical-work examples in the approved order', () => {
  const text = resume.body.textContent.replace(/\s+/g, ' ');
  const entries = [...resume.querySelectorAll('[data-selected-work]')];

  expect(entries.map((entry) => entry.querySelector('h3').textContent.trim())).toEqual([
    'Noor Notes',
    'Emergency Medicine Finder',
    'House Shifting Services',
  ]);
  expect(entries[0].textContent).toContain('Native Linux desktop application');
  expect(entries[1].textContent).toContain('Full-stack system prototype');
  expect(entries[1].textContent).not.toMatch(/production-grade|deployment-ready/i);
  expect(entries[2].textContent).toContain('Collaborative project');
  expect(entries[2].textContent).toContain('Individual ownership is not claimed');
  expect(text).toContain('Selected Technical Work');
  expect(text).not.toContain('Developer Evidence');
  expect(text).not.toContain('PCIU CGPA Calculator');
});
```

This catches reintroduction of the crowded four-project section or marketing language that overstates the prototype.

- [ ] **Step 3: Update education and link contracts**

Keep the existing education assertions and replace the link test with:

```js
it('keeps only the approved contact and public-work links clickable', () => {
  const hrefs = [...resume.querySelectorAll('a')].map((link) => link.href);

  expect(hrefs).toEqual([
    'mailto:mamun872381cpi@gmail.com',
    'tel:+8801580831003',
    'https://www.linkedin.com/in/abdullah-a-699a90117/',
    'https://github.com/saamaamr',
    'https://mamunsandwipi.vercel.app/',
    'https://github.com/saamaamr/noor-notes',
    'https://github.com/saamaamr/emergency-medicine-finder',
    'https://github.com/saamaamr/house-shifting-services',
  ]);
});

it('avoids semantic elements that Chrome maps to invalid PDF 1.4 structure roles', () => {
  expect(resume.querySelector('strong, aside')).toBeNull();
});
```

In the education test, remove expectations for `production-grade feature scope`, `not deployment-ready`, `Collaborative contribution`, and PCIU CGPA Calculator. Retain the B.Sc., GPA 3.76 / 4.00, Diploma, IT Support Technician, omitted Diploma GPA, omitted SSC, and omitted private-case-study assertions.

- [ ] **Step 4: Run the focused test and verify the expected red state**

Run:

```bash
npm test -- --runInBand tests/resume.test.js
```

Expected: FAIL because the current headline is `Technical Support Engineer`, the profile is longer, competency groups do not exist, the section is named `Developer Evidence`, and four project entries still render.

- [ ] **Step 5: Replace the page-one HTML structure**

Change the document title to:

```html
<title>Abdullah Al Mamun — Technical Support &amp; IT Operations Professional Resume</title>
```

Keep the five existing contact anchors and replace the first page body with this structure and exact copy:

```html
<article class="page page-one" aria-label="Resume page 1">
  <header class="page-header">
    <div>
      <h1>Abdullah Al Mamun</h1>
      <p class="role">Technical Support &amp; IT Operations Professional</p>
      <p class="location">Sandwip, Chattogram, Bangladesh</p>
    </div>
    <address class="contact">
      <a href="mailto:mamun872381cpi@gmail.com">mamun872381cpi@gmail.com</a>
      <a href="tel:+8801580831003">+880 1580-831003</a>
      <a href="https://www.linkedin.com/in/abdullah-a-699a90117/">linkedin.com/in/abdullah-a-699a90117</a>
      <a href="https://github.com/saamaamr">github.com/saamaamr</a>
      <a href="https://mamunsandwipi.vercel.app/">mamunsandwipi.vercel.app</a>
    </address>
  </header>
  <div class="content">
    <section class="section" aria-labelledby="profile-title">
      <h2 class="section-title" id="profile-title">Professional Profile</h2>
      <p class="summary">Technical support and IT operations professional with 7+ years of experience across software, travel operations, and financial services. Skilled in end-user support, hardware and software troubleshooting, website maintenance, defect reproduction, documentation, and clear coordination between users, clients, and technical teams.</p>
    </section>
    <section class="section" aria-labelledby="competencies-title">
      <h2 class="section-title" id="competencies-title">Core Competencies</h2>
      <div class="compact-grid">
        <article class="compact-card" data-core-competency><h3>End-user support</h3><p>Technical support · PC troubleshooting · Hardware · Software · Basic networking · File and data operations</p></article>
        <article class="compact-card" data-core-competency><h3>Website support</h3><p>WordPress · HTML/CSS · Browser diagnostics · Bug reproduction and reporting</p></article>
        <article class="compact-card" data-core-competency><h3>Communication &amp; quality</h3><p>Troubleshooting documentation · Client communication · Developer coordination · Accessibility awareness</p></article>
      </div>
    </section>
    <section class="section" aria-labelledby="experience-title">
      <h2 class="section-title" id="experience-title">Professional Experience</h2>
    </section>
  </div>
</article>
```

- [ ] **Step 6: Render the exact experience blocks**

Inside the page-one experience section, use:

```html
<article class="job">
  <div class="job-heading"><h3>Technical Support Engineer</h3><span class="date">May 2025 — Present</span></div>
  <p class="company">Bit Apps</p>
  <ul>
    <li>Maintain and troubleshoot client websites using WordPress, HTML, and CSS.</li>
    <li>Reproduce and document reported software issues for development review.</li>
    <li>Create troubleshooting guides and reusable support notes.</li>
    <li>Coordinate technical communication between clients and internal teams.</li>
  </ul>
</article>
<article class="job">
  <div class="job-heading"><h3>Senior Executive</h3><span class="date">January 2020 — April 2025</span></div>
  <p class="company">Kurnia Holiday Travels</p>
  <ul>
    <li>Supported day-to-day IT infrastructure, hardware installation, and software maintenance across departments.</li>
    <li>Analyzed operational data for promotion and budget decisions.</li>
    <li>Coordinated workplace technology needs across departments.</li>
  </ul>
</article>
<article class="job">
  <div class="job-heading"><h3>Junior IT Officer</h3><span class="date">January 2019 — December 2019</span></div>
  <p class="company">Century Securities Limited</p>
  <ul>
    <li>Provided technical support and data management in a time-sensitive stock-exchange environment.</li>
    <li>Installed and maintained workplace hardware and software.</li>
    <li>Performed routine system checks and responded to reported workstation issues.</li>
  </ul>
</article>
```

- [ ] **Step 7: Replace the page-two HTML structure**

Use this exact content order:

```html
<article class="page page-two" aria-label="Resume page 2">
  <div class="continuation">Abdullah Al Mamun · Technical Support &amp; IT Operations Professional</div>
  <div class="content">
    <section class="section" aria-labelledby="toolkit-title">
      <h2 class="section-title" id="toolkit-title">Technical Toolkit</h2>
      <div class="compact-grid toolkit-grid">
        <article class="compact-card"><h3>Support &amp; operations</h3><p>Hardware · Software · Basic networking · File management · Data operations</p></article>
        <article class="compact-card"><h3>Web &amp; diagnostics</h3><p>WordPress · HTML/CSS · Browser diagnostics · REST API awareness · SQL awareness</p></article>
        <article class="compact-card"><h3>Workflow &amp; quality</h3><p>GitHub · Postman · Jest · Documentation · Accessibility awareness</p></article>
      </div>
    </section>
    <section class="section" aria-labelledby="work-title">
      <h2 class="section-title" id="work-title">Selected Technical Work</h2>
      <article class="work-item" data-selected-work><div><h3>Noor Notes</h3><p class="work-label">Native Linux desktop application</p></div><p>Rust, GTK4, and libadwaita notes application with library and editor views, rich and source modes, encrypted local storage, autosave and recovery behavior, Linux packaging, and automated verification. <a href="https://github.com/saamaamr/noor-notes">Public repository</a></p></article>
      <article class="work-item" data-selected-work><div><h3>Emergency Medicine Finder</h3><p class="work-label">Full-stack system prototype</p></div><p>Node.js, Express, EJS, and MySQL prototype covering user, shopkeeper, and admin roles, inventory, requests, sales, expenses, exports, backups, validation, and tests. <a href="https://github.com/saamaamr/emergency-medicine-finder">Public repository</a></p></article>
      <article class="work-item" data-selected-work><div><h3>House Shifting Services</h3><p class="work-label">Collaborative project</p></div><p>Collaborative Node.js, Express, EJS, and MySQL service-booking project with user, worker, and admin workflows. Individual ownership is not claimed. <a href="https://github.com/saamaamr/house-shifting-services">Public repository</a></p></article>
    </section>
    <div class="two-column section">
      <section aria-labelledby="education-title">
        <h2 class="section-title" id="education-title">Education &amp; Certification</h2>
        <article class="education-item"><h3>B.Sc. in Computer Science Engineering</h3><p>Port City International University, Chattogram · 2023</p><p class="education-grade">GPA 3.76 / 4.00</p></article>
        <article class="education-item"><h3>Diploma in Engineering, Computer Technology</h3><p>Chittagong Polytechnic Institute, Chattogram · 2018</p></article>
        <article class="education-item"><h3>IT Support Technician, Levels 1 &amp; 2</h3><p>Bangladesh-Korea Technical Training Centre, Chattogram · 2017</p></article>
      </section>
      <div class="details" role="group" aria-label="Additional details">
        <section class="detail-block"><h3>Languages</h3><p>Bangla — Fluent<br>English — Good</p></section>
        <section class="detail-block"><h3>Availability</h3><p>Open to Technical Support, IT Support, and remote opportunities</p></section>
      </div>
    </div>
  </div>
</article>
```

- [ ] **Step 8: Apply the restrained print layout**

Keep the existing navy `#081a33`, teal `#72ddcd`, blue `#214fa8`, white page, and light-gray card palette. Replace the affected layout declarations with these exact values:

```css
body { font-size: 9.65pt; line-height: 1.36; }
.page { width: min(194mm, calc(100% - 24px)); min-height: 277mm; }
.page-header { grid-template-columns: 1fr auto; gap: 18px; padding: 15px 26px 14px; }
.page-header h1 { font-size: 22pt; line-height: 1.04; }
.role { margin: 4px 0 2px; font-size: 10.8pt; }
.location { font-size: 8.7pt; }
.contact { gap: 1px; font-size: 8.15pt; font-style: normal; line-height: 1.35; }
.content { padding: 14px 26px 18px; }
.section { margin-top: 11px; }
.section-title { margin-bottom: 6px; padding-bottom: 3px; font-size: 8.8pt; letter-spacing: 0.75px; }
.summary { font-size: 9.2pt; line-height: 1.42; }
.compact-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; }
.compact-card { border: 1px solid #d7e0ea; border-radius: 6px; background: #f8fafc; padding: 7px 8px; break-inside: avoid; }
.compact-card h3 { margin: 0 0 4px; color: #10243f; font-size: 8.8pt; }
.compact-card p { margin: 0; color: #4c5e73; font-size: 7.8pt; line-height: 1.38; }
.job { margin-top: 9px; break-inside: avoid; }
.job h3, .work-item h3, .education-item h3 { margin: 0; color: #10243f; font-size: 9.8pt; }
.date { font-size: 8.25pt; }
.company { margin: 1px 0 3px; font-size: 8.45pt; }
li { margin: 1.5px 0; font-size: 8.65pt; line-height: 1.35; }
.continuation { padding: 8px 26px; font-size: 8.2pt; }
.work-item { display: grid; grid-template-columns: 145px 1fr; gap: 12px; margin-top: 7px; border-bottom: 1px solid #e0e6ee; padding-bottom: 7px; break-inside: avoid; }
.work-label { margin: 2px 0 0; color: #168978; font-size: 7.5pt; font-weight: 800; text-transform: uppercase; }
.work-item > p { margin: 0; color: #43556b; font-size: 8.2pt; line-height: 1.38; }
.work-item a { color: #3157c8; font-weight: 700; }
.two-column { grid-template-columns: 1.18fr 0.82fr; gap: 18px; }
.education-item { margin-bottom: 7px; }
.education-item p, .education-grade { margin: 1px 0 0; font-size: 8.15pt; }
.details { gap: 8px; }
.detail-block { border-left: 3px solid #168978; padding: 7px 9px; }
.detail-block h3 { margin: 0 0 3px; font-size: 8.8pt; }
.detail-block p { margin: 0; font-size: 8.1pt; }
```

Remove the obsolete `.skills-grid`, `.skill-card`, `.evidence-item`, `.evidence-label`, and `.private` rules. Keep the existing `@page`, print reset, and responsive single-column behavior, updating the mobile selector list from `.skills-grid` to `.compact-grid` and from `.evidence-item` to `.work-item`.

- [ ] **Step 9: Run the focused test and verify green**

Run:

```bash
npm test -- --runInBand tests/resume.test.js
```

Expected: PASS with all résumé tests green and no invalid-role elements.

- [ ] **Step 10: Commit the HTML and source-test redesign**

```bash
git add tests/resume.test.js public/resume.html
git status --short
git commit -m "feat: redesign resume for universal support roles"
```

Expected before commit: only the two intended files are staged; `logs/combined.log` remains unstaged.

### Task 2: Regenerated PDF and Visual Verification

**Files:**
- Regenerate: `public/Abdullah Al Mamun Resume.pdf`

**Interfaces:**
- Consumes: `public/resume.html` through `scripts/generate-pdf.js` and `/usr/bin/google-chrome`.
- Produces: a tagged two-page A4 PDF at the existing public URL.

- [ ] **Step 1: Regenerate the PDF**

Run:

```bash
npm run generate-pdf
```

Expected: `PDF generated: /home/mamun/Documents/BackupOffice/Protfolio/public/Abdullah Al Mamun Resume.pdf`.

- [ ] **Step 2: Verify metadata and page contract**

Run:

```bash
pdfinfo "public/Abdullah Al Mamun Resume.pdf"
```

Expected fields:

```text
Title:           Abdullah Al Mamun — Technical Support & IT Operations Professional Resume
Tagged:          yes
Pages:           2
Page size:       595.92 x 841.92 pts (A4)
PDF version:     1.4
```

- [ ] **Step 3: Verify clickable annotations**

Run:

```bash
pdfinfo -url "public/Abdullah Al Mamun Resume.pdf"
```

Expected: annotations include exactly the eight unique destinations from Task 1's link test, and no URL contains `pciu-cgpa-calculator`, `facebook.com`, or `m.me`.

- [ ] **Step 4: Verify ATS extraction order**

Run:

```bash
pdftotext -layout "public/Abdullah Al Mamun Resume.pdf" /tmp/abdullah-universal-resume.txt
sed -n '1,260p' /tmp/abdullah-universal-resume.txt
```

Expected page-one order: name, universal headline, contact details, Professional Profile, Core Competencies, Professional Experience, then all three jobs. Expected page-two order: continuation label, Technical Toolkit, Selected Technical Work, three projects, Education & Certification, Languages, Availability.

- [ ] **Step 5: Render both pages for visual inspection**

Run:

```bash
pdftoppm -png -r 144 -f 1 -l 2 "public/Abdullah Al Mamun Resume.pdf" /tmp/abdullah-universal-resume
```

Inspect `/tmp/abdullah-universal-resume-1.png` and `/tmp/abdullah-universal-resume-2.png` at original resolution. Expected: no clipped or overlapping text; upright contact details; aligned dates; complete cards and entries; page-one and page-two content both extend through most of the printable height without crowding the bottom margin.

- [ ] **Step 6: Re-run the focused source test after PDF generation**

Run:

```bash
npm test -- --runInBand tests/resume.test.js
```

Expected: PASS.

- [ ] **Step 7: Commit the generated PDF**

```bash
git add "public/Abdullah Al Mamun Resume.pdf"
git status --short
git commit -m "docs: regenerate universal support resume PDF"
```

Expected before commit: only the PDF is staged; `logs/combined.log` remains unstaged.

### Task 3: Full Verification and Publication

**Files:**
- No additional source files modified.

**Interfaces:**
- Consumes: committed HTML, tests, and PDF from Tasks 1 and 2.
- Produces: verified local `main` and matching `origin/main` commits.

- [ ] **Step 1: Run the complete test suite**

Run:

```bash
npm test -- --runInBand
```

Expected: all Jest suites and tests PASS. If Supertest cannot bind a local ephemeral port in the sandbox, rerun the same command with the environment's approved local-port permission.

- [ ] **Step 2: Run build and repository integrity checks**

Run:

```bash
npm run build:css
git diff --check
git status --short
```

Expected: CSS build exits 0, `git diff --check` emits no output, and `logs/combined.log` is the only uncommitted file.

- [ ] **Step 3: Inspect the publication boundary**

Run:

```bash
git branch --show-current
git log -5 --oneline --decorate
git remote -v
```

Expected: current branch is `main`, the résumé design/implementation/PDF commits are present, and `origin` points to `https://github.com/saamaamr/portfolio.git`.

- [ ] **Step 4: Push verified main**

Run:

```bash
git push origin main
```

Expected: a fast-forward update of `origin/main`.

- [ ] **Step 5: Verify remote parity**

Run:

```bash
git rev-parse HEAD
git rev-parse origin/main
git status --short
```

Expected: local and remote hashes match and `logs/combined.log` remains the only uncommitted file.
