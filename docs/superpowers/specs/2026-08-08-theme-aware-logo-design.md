# Theme-Aware Logo Design

**Date:** 2026-08-08
**Status:** Approved

## Objective

Replace the current single “A” logo with the approved “AM Support Command” identity and provide coordinated light-theme and dark-theme variants that follow the portfolio’s manual or system-selected theme.

## Visual Design

Both variants use the same 64×64 SVG geometry so switching themes never changes layout:

- A shield silhouette represents support, security, and reliability.
- An AM monogram personalizes the identity.
- A command chevron and baseline represent technical operations.
- A connection dot represents communication and system connectivity.

The light variant uses a pale blue shield (`#eef2ff`), deep blue details (`#2444a5` and `#3157c8`), and cyan accent (`#22a9c5`). The dark variant uses a navy shield (`#121b2e`), periwinkle details (`#9cadff` and `#7895ff`), and bright cyan accent (`#4dd6e8`). Both must remain recognizable at 24px, 36px, and 64px.

## Assets

Create two standalone SVG files:

- `public/assets/logo-light.svg`
- `public/assets/logo-dark.svg`

The SVGs must use a `viewBox` of `0 0 64 64`, contain no scripts or external resources, and include no embedded text or font dependency. Keep `public/favicon.svg` only if required for backward compatibility; no active template or metadata reference should use it after migration.

The existing social card remains unchanged because it contains no previous logo.

## Navbar Integration

The existing accessible brand link remains the semantic owner of the logo and the visible “Abdullah Al Mamun” text. Inside it, render a non-semantic logo wrapper containing both SVG image assets with empty alt text:

- `.brand-logo-light` is visible in the default light theme.
- `.brand-logo-dark` is visible when the root element has `.dark`.

CSS performs the navbar swap, so the correct asset is visible as soon as `theme-init.js` applies the root theme class. Both images retain explicit 36×36 dimensions to prevent layout shift. Responsive brand-name behavior remains unchanged.

## Favicon Integration

Give the primary SVG favicon link the ID `site-favicon` and default it to `/assets/logo-light.svg`. The Apple touch icon also uses the light asset as the stable default.

Theme initialization and every later theme transition update `site-favicon.href` to the matching light or dark SVG. This includes:

- a saved `light` or `dark` preference;
- the initial system color-scheme preference when no preference is saved;
- manual theme-toggle changes;
- later system preference changes while no explicit preference is stored.

Favicon synchronization must fail safely when the link is absent, such as isolated unit-test documents.

## Code Boundaries

- `views/partials/navbar.ejs` renders the two navbar images.
- `views/partials/head.ejs` points favicon and Apple touch metadata to the new assets.
- `public/css/input.css` controls theme visibility and fixed logo dimensions.
- `public/js/theme-init.js` synchronizes the favicon during the pre-render theme decision.
- `public/js/script.js` synchronizes the favicon inside the existing theme lifecycle.
- `.gitignore` adds `.superpowers/` so visual-companion artifacts remain local.

No locale dictionary, route, content section, social card, or Resume asset changes are included.

## Accessibility and Performance

- The brand link keeps its localized accessible label.
- Both logo images use empty alt text because the brand name and link label already provide the accessible name.
- SVG assets are local, compact, and cacheable.
- Explicit dimensions prevent cumulative layout shift.
- The implementation adds no dependency and no inline executable code.

## Verification

- Page tests confirm both navbar assets, empty alt text, fixed dimensions, and the new favicon metadata.
- Frontend tests confirm favicon selection follows initial, manual, and system-driven theme changes.
- Source checks confirm no active view references `/favicon.svg`.
- The complete test suite and production CSS build pass.
- Browser verification covers light and dark themes at desktop and mobile widths, with visual checks at the 36px navbar size.
- Only intended logo, theme, CSS, template, test, ignore-rule, and workflow-documentation files are committed; `logs/combined.log` remains unstaged.

## Scope Boundaries

This change replaces the website logo and theme-aware favicon only. It does not redesign the navbar, change the site name, regenerate the social card, alter translations, or modify other portfolio functionality.
