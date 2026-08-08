# English Resume Labels Design

**Date:** 2026-08-08
**Status:** Approved

## Objective

Replace the accented English spelling “Résumé” and “résumé” in portfolio interface actions with the American-English spelling “Resume.”

## Scope

Update exactly three values in `locales/en-US.json`:

- `nav.resume`: `Résumé` → `Resume`
- `nav.downloadResume`: `Download résumé` → `Download Resume`
- `hero.downloadResume`: `Download résumé` → `Download Resume`

Do not change the Resume PDF filename, links, templates, README, or any non-English dictionary.

## Behavior

The desktop navbar will display “Resume.” The mobile navigation and hero download actions will display “Download Resume.” All three actions will continue linking to `/Abdullah Al Mamun Resume.pdf` with unchanged download/navigation behavior.

## Verification

- Add a page regression assertion that the rendered English page includes `Resume` and `Download Resume` but contains neither `Résumé` nor `résumé`.
- Confirm all locale dictionaries still share the same key structure.
- Run the page tests and the full test suite.
- Verify only the English dictionary, regression test, and workflow documentation are committed; preserve `logs/combined.log` unstaged.

## Scope Boundaries

This is an English copy correction only. It does not alter translations, layout, accessibility behavior, routes, styling, Resume files, or application logic.
