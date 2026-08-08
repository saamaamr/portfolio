# Universal Two-Page Résumé Design

**Date:** 2026-08-08

## Objective

Rebuild Abdullah Al Mamun's English résumé as a balanced, professional two-page document suitable for Technical Support, IT Support, Help Desk, Desktop Support, Website Support, and junior IT Operations roles. Keep every claim evidence-based and avoid invented outcomes, ticket volumes, tools, metrics, or service-level claims.

This design supersedes earlier résumé presentation requirements where they conflict with the structure and curated project set below. It does not change the website's evidence cards or public repository attribution.

## Positioning

Use the headline **Technical Support & IT Operations Professional**. Employment titles remain unchanged.

Use this professional profile:

> Technical support and IT operations professional with 7+ years of experience across software, travel operations, and financial services. Skilled in end-user support, hardware and software troubleshooting, website maintenance, defect reproduction, documentation, and clear coordination between users, clients, and technical teams.

Do not put availability language in the profile. Present availability in the page-two details area.

## Page 1 — Recruiter Essentials

### Header

Keep these five clickable contact destinations in this order:

1. Email: `mailto:mamun872381cpi@gmail.com`
2. Phone: `tel:+8801580831003`
3. LinkedIn: `https://www.linkedin.com/in/abdullah-a-699a90117/`
4. GitHub: `https://github.com/saamaamr`
5. Portfolio: `https://mamunsandwipi.vercel.app/`

Keep **Sandwip, Chattogram, Bangladesh** visible. Do not add Facebook, Messenger, a photograph, icons, a QR code, or decorative skill charts.

### Core Competencies

Place three compact groups immediately after the professional profile:

1. **End-user support:** Technical support · PC troubleshooting · Hardware · Software · Basic networking · File and data operations
2. **Website support:** WordPress · HTML/CSS · Browser diagnostics · Bug reproduction and reporting
3. **Communication & quality:** Troubleshooting documentation · Client communication · Developer coordination · Accessibility awareness

### Professional Experience

Keep all three jobs and dates in reverse chronological order.

**Technical Support Engineer — Bit Apps — May 2025 — Present**

- Maintain and troubleshoot client websites using WordPress, HTML, and CSS.
- Reproduce and document reported software issues for development review.
- Create troubleshooting guides and reusable support notes.
- Coordinate technical communication between clients and internal teams.

**Senior Executive — Kurnia Holiday Travels — January 2020 — April 2025**

- Supported day-to-day IT infrastructure, hardware installation, and software maintenance across departments.
- Analyzed operational data for promotion and budget decisions.
- Coordinated workplace technology needs across departments.

**Junior IT Officer — Century Securities Limited — January 2019 — December 2019**

- Provided technical support and data management in a time-sensitive stock-exchange environment.
- Installed and maintained workplace hardware and software.
- Performed routine system checks and responded to reported workstation issues.

## Page 2 — Supporting Qualifications

### Technical Toolkit

Present these tools and knowledge areas compactly without proficiency ratings:

- **Support & operations:** Hardware · Software · Basic networking · File management · Data operations
- **Web & diagnostics:** WordPress · HTML/CSS · Browser diagnostics · REST API awareness · SQL awareness
- **Workflow & quality:** GitHub · Postman · Jest · Documentation · Accessibility awareness

### Selected Technical Work

Replace **Developer Evidence** with **Selected Technical Work** and keep only these three entries in this order:

1. **Noor Notes — Native Linux desktop application**
   - Describe it as a Rust, GTK4, and libadwaita notes application with library and editor views, rich and source modes, encrypted local storage, autosave and recovery behavior, Linux packaging, and automated verification.
   - Link to `https://github.com/saamaamr/noor-notes`.
2. **Emergency Medicine Finder — Full-stack system prototype**
   - Describe it as a Node.js, Express, EJS, and MySQL prototype covering user, shopkeeper, and admin roles, inventory, requests, sales, expenses, exports, backups, validation, and tests.
   - Do not call it production-grade or deployment-ready.
   - Link to `https://github.com/saamaamr/emergency-medicine-finder`.
3. **House Shifting Services — Collaborative project**
   - Describe it as a collaborative Node.js, Express, EJS, and MySQL service-booking project with user, worker, and admin workflows.
   - State that individual ownership is not claimed.
   - Link to `https://github.com/saamaamr/house-shifting-services`.

Remove PCIU CGPA Calculator from the résumé only. It remains visible as a collaborative contribution on the portfolio.

### Education and Details

Keep these credentials:

- B.Sc. in Computer Science Engineering — Port City International University, Chattogram — 2023 — GPA 3.76 / 4.00
- Diploma in Engineering, Computer Technology — Chittagong Polytechnic Institute, Chattogram — 2018
- IT Support Technician, Levels 1 & 2 — Bangladesh-Korea Technical Training Centre, Chattogram — 2017

Keep these details:

- Languages: Bangla — Fluent; English — Good
- Availability: Open to Technical Support, IT Support, and remote opportunities

Do not restore the Diploma GPA, SSC, private project evidence, or unsupported claims.

## Visual System

Preserve the existing navy and teal identity while making the presentation more restrained:

- reduce the page-one header height;
- render contact details upright rather than italic;
- use a clear single-column reading order for the profile and experience;
- use compact grids only for competencies, toolkit, education, and details;
- balance the two pages so neither has a large empty lower half or an overcrowded content block;
- use consistent section spacing, bullet indentation, date alignment, and typographic hierarchy;
- avoid tables, progress bars, ratings, photographs, icons, and background graphics.

The browser view remains responsive, but print layout is the primary design target.

## Accessibility, ATS, and PDF Contract

- Keep semantic headings, sections, articles, lists, address markup, and descriptive page labels.
- Avoid `strong` and `aside` elements because Chrome maps them to invalid PDF 1.4 structure roles in this pipeline.
- Preserve logical text extraction order and real text rather than rasterized content.
- Preserve clickable email, telephone, LinkedIn, GitHub, portfolio, and three repository links.
- Generate exactly two tagged A4 pages with PDF version 1.4.
- Ensure page boundaries do not split a job, competency group, project entry, or education entry.
- Verify the PDF has no clipped or overlapping text and both pages have balanced visible content.

## Automated and Manual Verification

Update the résumé source tests to require the universal headline, concise profile, three selected projects, new prototype/collaboration wording, exact link set, education, languages, and availability. Tests must reject the previous **Developer Evidence** heading, PCIU CGPA Calculator, production-grade/deployment-ready wording, and unsupported results.

Regenerate `public/Abdullah Al Mamun Resume.pdf`, then verify:

- focused and full Jest suites pass;
- `pdfinfo` reports two tagged A4 pages and PDF 1.4;
- `pdfinfo -url` reports all required link annotations;
- `pdftotext -layout` produces a sensible page-one then page-two reading order;
- rendered page images show no clipping, overlap, excessive empty space, or density imbalance;
- `git diff --check` is clean.
