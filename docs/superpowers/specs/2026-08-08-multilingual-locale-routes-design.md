# Multilingual Locale Routes Design

## Objective

Add complete, server-rendered multilingual portfolio pages while keeping American English as the default experience. Visitors can switch among English (US), Bangla, Hindi, Arabic, Spanish, and French from an accessible language control in the main navigation.

## Supported locales and URLs

| Locale | Language | Route | Direction |
| --- | --- | --- | --- |
| `en-US` | English (US) | `/` | LTR |
| `bn` | বাংলা | `/bn` | LTR |
| `hi` | हिन्दी | `/hi` | LTR |
| `ar` | العربية | `/ar` | RTL |
| `es` | Español | `/es` | LTR |
| `fr` | Français | `/fr` | LTR |

The root route always renders American English. Locale selection is represented by the URL rather than a cookie or browser-language redirect, so the default remains predictable and every translated page is linkable, crawlable, and shareable.

## Content scope

Every user-facing interface string is translated:

- Skip navigation, navigation links, language and theme controls, mobile menu labels, and résumé actions
- Hero copy, typewriter phrases, capability cards, career metrics, experience copy, project descriptions, skills, education, contact copy, profile strip, and footer
- Form labels, hints, field validation, submission state, success state, and generic service errors
- Image alternative text, section and group accessibility labels, button titles, and screen-reader-only content
- Page title, description, Open Graph copy, Twitter copy, structured metadata, 404 content, and API-visible generic contact messages where displayed by the portfolio

Personal names, company names, institution names, product/project names, technology names, email addresses, phone numbers, dates, numeric measurements, URLs, and repository links remain unchanged unless a translated sentence grammatically surrounds them.

## Translation data

Locale dictionaries live in `locales/` as JSON files:

- `en-US.json` is the canonical source and fallback dictionary.
- `bn.json`, `hi.json`, `ar.json`, `es.json`, and `fr.json` must contain the exact same key set.
- Keys use stable semantic paths such as `nav.summary`, `hero.title`, `experience.bitApps.summary`, and `form.errors.emailInvalid`.
- Translation values are plain text. Markup and icons stay in EJS templates to prevent translated content from injecting HTML.

`utils/i18n.js` owns locale resolution, nested-key lookup, URL construction, direction selection, dictionary completeness checks, and safe client-message serialization. Missing or invalid locale data falls back to the matching American English value without breaking page rendering.

## Server rendering

The portfolio route renders through one shared handler:

- `GET /` resolves `en-US`.
- `GET /:locale` accepts only `bn`, `hi`, `ar`, `es`, or `fr`.
- Unsupported single-segment and nested paths continue to the branded 404 handler.

The handler passes the selected locale, text direction, translator function, supported-language metadata, locale-specific canonical URL, alternate URLs, and a restricted client-message object to EJS. Templates call `t(key)` and keep the existing semantic HTML structure.

The HTML element receives the correct `lang` and `dir`. Arabic uses `lang="ar" dir="rtl"`; all other pages use `dir="ltr"`. CSS adds targeted logical-property and RTL adjustments without duplicating the visual system.

## Language selector

The language control sits in the navigation actions before the theme control. It uses a button and menu with visible language names in their native scripts. The selected language is clearly indicated, and the control supports keyboard activation, Escape-to-close, outside-click closing, focus return, and mobile layouts.

Each option is a normal link to its locale route, so language switching works without JavaScript. JavaScript enhances menu behavior but does not own navigation. The mobile menu contains the same locale choices or a compact equivalent using the same links.

## Client-side behavior

The server provides only the selected locale's dynamic message subset to the browser in a nonce-authorized `application/json` script block. The client reads that data to localize:

- Theme and mobile-menu accessible labels
- Typewriter phrases
- Contact validation and submission messages
- Loading and error states

`validateContactFields(values, messages)` accepts an optional message object and retains American English defaults for API consumers and existing tests. Contact submissions send the selected locale in the `Accept-Language` header, but the client uses its local dictionary for all predictable display states so network failures remain translated.

## SEO

Each locale route has:

- A self-referencing canonical URL
- `hreflang` alternates for `en-US`, `bn`, `hi`, `ar`, `es`, and `fr`
- An `x-default` alternate pointing to `/`
- Localized title, description, Open Graph title/description, Twitter title/description, and structured-data descriptive fields
- The existing shared social image

The sitemap lists all six routes. The default Open Graph URL and structured-data URL match the current locale route.

## Accessibility and layout

The feature preserves the existing skip link, heading hierarchy, focus indicators, reduced-motion behavior, and form relationships. The language menu exposes expanded state and a programmatic label. Changing routes gives assistive technology a correctly localized document rather than replacing the page silently.

Longer translations may wrap naturally. Navigation labels, buttons, cards, timeline content, forms, and RTL pages must be checked at 1440px, tablet width, and 390px. Logical CSS properties are preferred for new spacing and alignment rules.

## Error handling

- Missing translation keys return American English and may log a development warning without exposing an exception to visitors.
- Malformed locale JSON fails startup or tests with the locale and key identified.
- Unknown locale routes render the branded 404 page; paths beginning with a known locale render that locale's 404 copy.
- Contact-service failures display a localized generic message and do not reveal SMTP details.

## Testing

Automated tests must prove:

- All six dictionaries contain the same key set and non-empty string values.
- `/` renders American English and each locale route renders representative translated content.
- Arabic renders `dir="rtl"`; the others render `dir="ltr"`.
- Canonical and `hreflang` URLs are correct for every locale.
- The language selector contains six working route links and indicates the current language.
- The client applies locale-specific validation, typewriter, theme, and menu messages.
- Missing keys fall back to American English.
- The English and Arabic rendered documents have no detectable automated accessibility violations.
- Existing contact API, email retry, CSP nonce, startup, and portfolio structure tests continue to pass.

Manual verification covers the selector, wrapping, focus behavior, and complete-page rendering at desktop and mobile sizes in all six locales, with specific RTL inspection for Arabic.

## Non-goals

- No external machine-translation service or third-party language widget
- No automatic browser-language redirect
- No translation management dashboard
- No separate translated résumé PDFs in this iteration
- No changes to contact details, employment facts, project facts, or source links
