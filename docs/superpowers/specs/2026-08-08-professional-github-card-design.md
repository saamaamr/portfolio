# Professional GitHub Card Design

**Date:** 2026-08-08

## Objective

Replace the hero card's audit-like repository-history wording with concise, professional copy that invites recruiters to explore Abdullah Al Mamun's GitHub work.

## Approved Copy

The linked card keeps its current three-level hierarchy:

1. Heading: **GitHub**
2. Descriptor: **Projects and contributions**
3. Link prompt: **Explore my work ↗**

Its English accessible label becomes **Explore Abdullah Al Mamun's projects and contributions on GitHub**.

## Scope

- Keep the existing card position, GitHub profile URL, external-link behavior, reveal animation, and visual styling.
- Replace the four repository-history locale keys with purpose-based GitHub-card keys in all six locale dictionaries.
- Translate the heading, descriptor, link prompt, and accessible label naturally in Bangla, Hindi, Arabic, Spanish, and French.
- Update the focused page and localization tests to require the new wording and reject the former `Since 2022` and `Public repository history` copy.
- Update current public documentation where it presents the hero card as a repository-history metric.
- Do not change project cards, other GitHub links, the résumé, or unrelated hero metrics.

## Accessibility and Verification

The entire card remains a keyboard-accessible anchor with `target="_blank"` and `rel="noopener noreferrer"`. The accessible label identifies the owner, content, and GitHub destination without relying on the arrow icon.

Verification covers all locale dictionaries, rendered English content, the unchanged link contract, the CSS build, and the full test suite.
