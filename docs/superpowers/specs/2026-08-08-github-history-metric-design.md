# GitHub History Metric Design

> **Superseded:** The hero-card wording and locale interface in this document were replaced by `2026-08-08-professional-github-card-design.md`. The historical GitHub audit remains decision context only.

## Objective

Replace the unverified `50+ workstations supported` claim with a repository-history fact that recruiters can verify directly.

## Verified basis

The public GitHub audit performed on 2026-08-08 found that Abdullah Al Mamun's earliest currently public repository was created on 2022-06-21. The portfolio may therefore state that public repository history exists **since 2022**. This wording does not claim continuous activity, a commit total, sole authorship, or ownership of collaborative repositories.

Evidence source: `https://github.com/saamaamr`

## Website presentation

The hero retains three proof cards in this order:

1. `7+` - Years in technology
2. `Since 2022` - Public repository history
3. `3` - Industries supported

The repository-history card is a keyboard-accessible external link to the GitHub profile. It includes visible `View GitHub profile` text and an external-link indicator. Existing GitHub links elsewhere remain unchanged because the metric link serves as the evidence source for this specific claim.

The card keeps the existing reveal behavior. It is not a numeric counter, so `Since 2022` is rendered as static text rather than using the counter JavaScript.

The primary hero CTA changes from `View support experience` to `View experience` in all six locales. Its destination remains `#experience`, and its existing button styling and icon remain unchanged.

## Claim removal

Remove `50+ workstations` and equivalent localized claims from:

- the hero metric;
- the Century Securities experience bullet;
- the résumé summary and experience bullet;
- current tests, README text, and portfolio planning/specification documents.

Preserve the supported underlying experience with non-quantified wording such as `Installed and maintained workplace hardware and software.`

## Localization and accessibility

All six locale dictionaries remain key-identical. Each locale receives translations for `Since 2022`, `Public repository history`, and `View GitHub profile`, plus non-quantified Century Securities wording.

The linked metric has a descriptive accessible name, visible keyboard focus, sufficient contrast, and `target="_blank"` with `rel="noopener noreferrer"`.

## Résumé and verification

Regenerate the two-page PDF after updating the HTML résumé. Verify rendered website content, all locale dictionaries, PDF text and links, CSS build output, the full test suite, and absence of the removed claim across current source and documentation.
