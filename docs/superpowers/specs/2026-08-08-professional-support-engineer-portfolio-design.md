# Professional Technical Support Engineer Portfolio Design

## Objective

Redesign the existing portfolio around one professional identity: **Technical Support Engineer**. The page must help recruiters in Bangladesh and international markets quickly understand Abdullah Al Mamun's support experience, troubleshooting process, technical depth, and availability for remote opportunities.

Development knowledge remains supporting evidence only. The portfolio must not position Abdullah as a Web Developer or Full-Stack Developer.

## Content Integrity

Every factual claim must be traceable to the existing resume, employment history, repository evidence, or a direct user confirmation. Do not invent tools, ticket volumes, percentages, service-level results, customer-satisfaction scores, or business outcomes.

- Keep “Open to remote opportunities,” confirmed by the user.
- Present “Available in six languages” as a portfolio capability, not personal language proficiency.
- Describe Emergency Medicine Finder as having a “production-grade feature scope,” while acknowledging documented security remediation needs; do not call it deployment-ready.
- Present House Shifting Services as collaborative work and describe only the user's contribution.
- Exclude PCIU CGPA Calculator because the reviewed fork does not contain authored work on its current branch.
- Present the private attendance application only as a redacted case study. Do not link the private repository, expose credentials, show private data, or identify an employer unless separately approved.
- Use only verified metrics: 7+ years in technology, 50+ supported workstations, and experience across three industries.
- Keep personal language claims at “Bangla — Fluent” and “English — Good.”

## Page Experience

### Navigation and hero

Retain the fixed responsive navigation, locale selector, light/dark theme control, resume action, mobile menu, and active-section behavior. Navigation contains Summary, Experience, Approach, Evidence, Skills, and Contact.

The hero uses:

- Status: “Open to Technical Support opportunities”
- Eyebrow: “User support · Website support · IT operations”
- Headline: “Clear support for people, software, and systems.”
- Introduction grounded in the resume: diagnosing hardware, software, website, access, and workflow issues; reproducing and documenting defects; and coordinating resolutions between users, clients, and technical teams.
- Primary action: “View support experience”
- Secondary action: “Contact me”
- Existing portrait, professional links, location, current role, and support focus

Immediately after the hero, show four proof cards: 7+ years in technology, 50+ workstations supported, three industries supported, and portfolio available in six languages.

### Support capabilities and experience

Capabilities are limited to evidence-backed themes:

1. End-user support: hardware, software, configuration, peripheral, access, and workflow assistance.
2. Website support: WordPress and HTML/CSS maintenance, browser/content issues, and reported defects.
3. Issue investigation: reproduction steps, evidence collection, root-cause isolation, escalation, and verification.
4. Knowledge sharing: troubleshooting guides, user instructions, bug reports, and handover notes.

Experience remains the primary proof and appears before repository work:

- Bit Apps — Technical Support Engineer, May 2025–Present
- Kurnia Holiday Travels — Senior Executive with IT operations responsibilities, January 2020–April 2025
- Century Securities Limited — Junior IT Officer, January–December 2019

Use present tense for the current role and past tense for previous roles. Preserve the confirmed 50+ workstation figure. Do not add quantitative outcomes until evidence is supplied.

### Support approach

Show a six-stage workflow to communicate professional judgment:

1. Listen — user, expected behavior, environment, and impact
2. Triage — urgency, scope, affected users, and business impact
3. Reproduce — dependable steps, symptoms, versions, and evidence
4. Diagnose — likely cause across software, hardware, data, or workflow
5. Resolve — safe fix, verification, or technical escalation
6. Document — resolution notes and reusable knowledge

This section describes the approach demonstrated by the resume and repositories; it must not imply experience with a specific ticketing or ITSM platform.

### Technical support evidence

Replace the generic development-project section with support-centered evidence using authentic screenshots, diagrams, or redacted interfaces.

1. **Noor Notes — Release and troubleshooting readiness**
   - Public repository and original authored work.
   - Focus on Linux installation diagnostics, compatibility guidance, recovery and backup documentation, safe failure states, encrypted local storage, packaging checks, issue-report instructions, and automated verification.
   - Link to the public repository and a concise support case study.

2. **Smart Attendance Tracker — Synchronization and operational reliability**
   - Private system shown only through approved redacted visuals.
   - Focus on Google Sheets/local synchronization, rate-limit retries, conflict logs, status monitoring, correction history, backups, exports, caching, and offline PWA behavior.
   - No repository link, credentials, personal attendance data, or confidential identifiers.

3. **Emergency Medicine Finder — Supportability, testing, and remediation awareness**
   - Describe the system as having a production-grade feature scope, including multiple roles, operational workflows, backups, exports, validation, and tests.
   - Explicitly avoid claiming production deployment readiness while documented CSRF, rate-limit, security-header, cookie, validation, and upload-hardening work remains.
   - Focus the case study on troubleshooting documentation, role-permission analysis, backup diagnostics, testing, known limitations, and remediation priorities.

House Shifting Services may appear in a small “Collaborative contribution” note only when the exact contribution can be described. It is not one of the three primary evidence cards.

### Skills, education, and resume

Organize skills by support outcomes rather than development categories:

- Support and operations: technical support, PC troubleshooting, hardware, software, networking, file management, and data operations
- Website and product support: WordPress, HTML/CSS, browser diagnostics, bug reproduction, REST API awareness, and SQL awareness
- Quality and communication: documentation, GitHub, Postman, Jest, accessibility, client communication, and developer coordination

Do not add Active Directory, Microsoft 365, ticketing systems, SLA management, remote-support tools, or other common support keywords unless the user confirms real experience.

Retain the B.Sc., Diploma, and IT Support Technician Levels 1 & 2 certification. Keep the B.Sc. GPA; omit the lower Diploma GPA from the recruiter-focused presentation. SSC may remain in the website education timeline but should be omitted from the international resume unless required for a specific application.

Rewrite the resume summary and skills around Technical Support Engineer positioning. Replace developer-heavy project inventories with concise technical support evidence. Preserve the two-page tagged A4 PDF, clickable contact links, and ATS-readable extraction order.

### Contact and footer

Keep the current contact system after Skills/Education and before the footer:

- Direct email, phone, WhatsApp, and LinkedIn
- Existing contact form and localized validation behavior
- Availability: open to Technical Support and remote opportunities
- Location: Sandwip, Chattogram, Bangladesh
- Languages: Bangla — Fluent; English — Good
- Existing interests: travelling, gardening, cycling, and photography
- Footer links to GitHub, LinkedIn, email, and Facebook, plus the theme control behavior already provided by the page

The hero CTA and navigation Contact item must scroll to this section.

## Visual and Interaction Direction

Use the approved full-page direction: professional dark navy hero and experience sections, warm off-white content sections, restrained teal and blue accents, authentic portrait, compact evidence cards, and alternating section backgrounds. The tone should feel calm, capable, and approachable rather than developer-centric or visually theatrical.

Retain the existing responsive, accessible foundations: semantic sections, skip link, keyboard-operable menus, visible focus, reduced-motion support, localized RTL behavior, form status announcements, and progressive enhancement. Reduce excessive hero empty space so the proof metrics are discoverable sooner. Simplify the mobile timeline so experience cards use the available width.

Replace generic stock project photographs with real Noor Notes screenshots, approved redacted attendance visuals, and a truthful Emergency Medicine Finder supportability visual. Provide meaningful alternative text.

## Architecture and Interfaces

Keep the current Express, EJS, locale JSON, Tailwind CSS, and vanilla JavaScript architecture. No new backend service or database is required.

- Keep `GET /`, localized page routes, `POST /contact`, the resume PDF URL, and existing contact request/response shapes unchanged.
- Extend the locale dictionaries for the new Approach, Evidence, availability, attribution, and case-study copy while maintaining exact key parity across all six locales.
- Localize experience dates instead of leaving English month names on translated routes.
- Label the downloadable document as an English resume on non-English routes unless localized PDFs are later supplied.
- Keep repository metadata and private-case-study content in authored page data; never fetch private GitHub content in the browser.

## Verification and Acceptance

Automated and browser verification must cover:

- No “Web Developer” or “Full-Stack Developer” professional positioning remains.
- Verified metrics and repository attribution render exactly as defined.
- Emergency Medicine Finder is not described as deployment-ready, and known remediation context is not hidden.
- House Shifting Services is never presented as solo work; PCIU CGPA Calculator is absent.
- Private attendance content contains no repository URL, credentials, personal records, or confidential identifiers.
- All six locale files retain matching, non-empty keys; Arabic remains RTL; dates and new support copy are localized.
- Desktop and mobile layouts have no horizontal overflow; the mobile experience timeline uses the available width.
- Theme, locale, navigation, resume, external links, contact form, validation, rate limiting, and localized form status continue to work.
- Accessibility checks cover headings, landmarks, focus order, contrast, menu state, form errors, reduced motion, and meaningful image alternatives.
- The regenerated resume is two-page A4, tagged, visually balanced, clickable, and extracts in a sensible ATS reading order.

The design is successful when a recruiter can identify Abdullah as a Technical Support Engineer within five seconds, find verified work evidence without encountering inflated ownership or outcome claims, and reach a working contact method from both the hero and final section.
