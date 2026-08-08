# Professional Portfolio Auto-Reply Design

**Date:** 2026-08-08

## Objective

Replace the current basic portfolio auto-reply with a polished, recruiter-friendly acknowledgement that confirms receipt without promising an unsupported response time. Keep the owner notification flow, SMTP transport, retry policy, and contact endpoint behavior unchanged.

## Message Content

Use the fixed subject:

```text
Thank you for contacting Abdullah Al Mamun
```

Use this content in both HTML and plain-text forms:

```text
Hello [Name],

Thank you for contacting me through my portfolio. I have received your message and appreciate your interest.

I will review your inquiry and respond as soon as possible.

Your message:
[Submitted message]

Best regards,
Abdullah Al Mamun
Technical Support Engineer
mamunsandwipi.vercel.app

This is an automated confirmation that your message was received.
```

Do not include “within 24–48 hours” or another response-time promise.

## Visual Design

- Use a centered, 600-pixel maximum-width email card on a soft neutral background.
- Use a dark navy header, restrained teal accent, white content area, and high-contrast body text consistent with the portfolio.
- Display “Message received” as the header label and “Thank you for reaching out” as the main heading.
- Render the submitted message in a clearly separated pale panel with a teal left border.
- Render the name, role, and portfolio URL as a compact professional signature.
- Put the automated-confirmation sentence in a subtle footer separated by a border.
- Use inline styles, system fonts, table-based outer layout, and no external images, fonts, stylesheets, scripts, tracking pixels, or remote assets.
- Make the layout readable on narrow clients with fluid width, 16-pixel body text, generous line height, and link text that remains understandable without color.

## Data and Safety

- Escape the submitted name and message before inserting them into HTML.
- Preserve message line breaks in both HTML and plain-text forms.
- Use a fixed subject so submitted content cannot alter it.
- Keep the validated submitter email only in the `to` field.
- Add a matching `text` property to the Nodemailer message for clients that block HTML.
- Do not expose SMTP credentials, internal error details, or contact-owner configuration.

## Testing

- Capture the auto-reply through the existing mocked transporter.
- Assert the fixed subject, sender, recipient, HTML body, plain-text body, professional signature, portfolio URL, and automated-confirmation footer.
- Assert the old 24–48-hour promise is absent.
- Assert raw submitted HTML cannot appear as executable markup in the HTML body.
- Assert the owner notification still sends when the auto-reply fails.
- Run the email tests, full suite, and one production contact submission after deployment.

## Out of Scope

- Redesigning the owner notification email.
- Changing SMTP credentials or retry behavior.
- Adding attachments, logos, marketing banners, analytics, or tracking.
- Changing the public contact form fields or success response.
