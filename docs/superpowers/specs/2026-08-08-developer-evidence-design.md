# Developer Evidence Portfolio Design

**Date:** 2026-08-08

## Objective

Reframe the portfolio's evidence section as developer evidence while preserving Abdullah Al Mamun's primary Technical Support Engineer positioning. The section must use only these three public repositories, in this order:

1. Emergency Medicine Finder — `https://github.com/saamaamr/emergency-medicine-finder`
2. Noor Notes — `https://github.com/saamaamr/noor-notes`
3. House Shifting Services — `https://github.com/saamaamr/house-shifting-services`

## Content Structure

- Change the evidence eyebrow to **Developer Evidence**.
- Keep the section heading exactly **Evidence from systems I have worked on** in English and translate it faithfully in the other five portfolio languages.
- Replace Smart Attendance Tracker with House Shifting Services in the three-card evidence grid.
- Remove the separate House Shifting Services attribution note after it becomes a primary card.
- Keep the main portfolio narrative and hero focused on Technical Support Engineer work. Developer evidence is supporting experience, not a replacement professional identity.

## Evidence Boundaries

- Derive every technical description from the public repository source, documentation, history, or direct user confirmation.
- Do not invent metrics, performance improvements, adoption claims, deployment status, responsibilities, or individual contribution boundaries.
- Keep Emergency Medicine Finder's documented deployment-readiness limitations visible and do not describe it as deployment-ready.
- Identify House Shifting Services visibly as **Collaborative work**. Do not imply sole authorship or claim an undocumented individual contribution.
- Present Noor Notes using only repository-supported facts and authentic project evidence.

## Visual Treatment

- Preserve the existing three-card responsive grid and professional portfolio visual system.
- Use one truthful local visual per repository. Prefer authentic screenshots already present in or verifiably associated with the repository; use a neutral repository-derived diagram only when no safe screenshot exists.
- Give each visual meaningful localized alternative text.
- Keep the collaborative label and Emergency Medicine Finder limitation visually prominent rather than hiding either in a tooltip or modal.

## Consistency Across Outputs

Apply the same evidence set and attribution rules to:

- the main EJS portfolio page;
- all six locale dictionaries;
- the English HTML résumé and regenerated PDF;
- README evidence documentation;
- automated page, localization, and résumé tests.

Smart Attendance Tracker will no longer appear in the portfolio's primary developer evidence or résumé evidence sections. Its private repository, credentials, employer information, and private data remain undisclosed.

## Verification

- Confirm exactly three evidence cards and three public repository links render in the required order.
- Confirm House Shifting Services is labeled collaborative everywhere it appears.
- Confirm Emergency Medicine Finder limitations remain visible.
- Confirm Smart Attendance Tracker is absent from the evidence cards and résumé evidence section.
- Confirm locale dictionaries retain exact key parity and localized routes render successfully.
- Regenerate and validate the résumé PDF.
- Run the complete automated test suite, production CSS build, claim audit, link audit, and responsive browser checks before committing the implementation.

## Out of Scope

- Changing the primary Technical Support Engineer positioning.
- Adding unverified project outcomes or personal contribution claims.
- Exposing private repository material.
- SMTP deployment configuration, which is handled as a separate operational task and never committed with credentials.
