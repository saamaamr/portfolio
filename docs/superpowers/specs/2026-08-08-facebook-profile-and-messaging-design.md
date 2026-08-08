# Facebook Profile and Messaging Links Design

**Date:** 2026-08-08

## Objective

Make Abdullah Al Mamun's existing Facebook identity visible in the hero and provide a direct Facebook Messenger action in the contact section.

## Link Roles and Placement

The two links serve different visitor intents:

1. Add **Facebook** after LinkedIn in the hero's professional-profile links. It opens the canonical profile at `https://www.facebook.com/saamaamr1`.
2. Add **Facebook Messenger** after LinkedIn in the Direct contact panel. It displays the localized action **Send a message** and opens `https://m.me/saamaamr1`.

Both links open in a new tab with `target="_blank"` and `rel="noopener noreferrer"`. The hero link uses the existing Facebook brand icon. The Direct contact link uses the Facebook Messenger brand icon and follows the existing contact-row structure.

## Localization

Add one key, `contact.facebookMessage`, to all six locale dictionaries with these exact values:

- English: **Send a message**
- Bangla: **বার্তা পাঠান**
- Hindi: **संदेश भेजें**
- Arabic: **إرسال رسالة**
- Spanish: **Enviar un mensaje**
- French: **Envoyer un message**

The platform names **Facebook** and **Facebook Messenger** remain untranslated brand names.

All locale dictionaries remain key-identical.

## Existing Integrations

Keep the current Facebook footer link and the Facebook URL in the Person structured data unchanged. Do not add Facebook to the résumé, project evidence, contact form, or navigation.

The Facebook additions will be implemented alongside the already approved professional GitHub-card copy change. The two changes share the locale and page tests but remain separate rendered links.

## Accessibility and Responsive Behavior

Each link has descriptive visible text and a decorative icon hidden from assistive technology. Existing hero-social wrapping and contact-panel row styles handle the additional links at desktop and mobile widths; no new layout or JavaScript behavior is required.

## Verification

Page tests require the exact profile and Messenger destinations, their new-tab security attributes, their placement in the intended regions, and the visible Facebook/Messenger labels. Localization tests require `contact.facebookMessage` and continued key parity across all six dictionaries. Full test and CSS-build verification covers regressions.
