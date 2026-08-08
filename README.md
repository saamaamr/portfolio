# Abdullah Al Mamun — Technical Support Engineer Portfolio

A production-ready portfolio presenting technical support, website maintenance, IT operations, troubleshooting, and full-stack development experience. It combines recruiter-focused content with accessible interactions, six server-rendered languages, secure contact handling, and responsive presentation.

## Live Portfolio

Visit [mamunsandwipi.vercel.app](https://mamunsandwipi.vercel.app).

## Highlights

- Resume-first introduction with capabilities, professional experience, selected projects, skills, education, and contact sections
- Server-rendered American English, Bangla, Hindi, Arabic, Spanish, and French content
- Accessible language selector with localized navigation, forms, validation, metadata, and error pages
- Right-to-left layout support for Arabic and responsive layouts for desktop, tablet, and mobile
- Keyboard navigation, skip link, managed focus, semantic markup, reduced-motion support, and automated accessibility checks
- Light and dark themes with saved preferences and system-theme fallback
- Contact API with client/server validation, rate limiting, payload limits, SMTP retry handling, and safe error responses
- Nonce-based Content Security Policy, security headers, structured data, canonical links, hreflang alternates, sitemap, and robots file
- Lightweight canvas ambience, reveal effects, counters, and localized typewriter content
- Browser-ready HTML Resume with PDF generation support

## Languages

American English is the default. Language selection uses stable URL routes, so every translation can be linked, indexed, and shared directly.

| Language | Route | Locale | Direction | Status |
| --- | --- | --- | --- | --- |
| American English | [`/`](https://mamunsandwipi.vercel.app/) | `en-US` | LTR | Default |
| Bangla | [`/bn`](https://mamunsandwipi.vercel.app/bn) | `bn` | LTR | Translated |
| Hindi | [`/hi`](https://mamunsandwipi.vercel.app/hi) | `hi` | LTR | Translated |
| Arabic | [`/ar`](https://mamunsandwipi.vercel.app/ar) | `ar` | RTL | Translated |
| Spanish | [`/es`](https://mamunsandwipi.vercel.app/es) | `es` | LTR | Translated |
| French | [`/fr`](https://mamunsandwipi.vercel.app/fr) | `fr` | LTR | Translated |

## Technology

- Node.js and Express for server rendering and the contact API
- EJS templates and JSON locale dictionaries for translated HTML
- Tailwind CSS v4 with custom responsive and RTL styles
- Vanilla JavaScript for theme, navigation, validation, animation, and language-menu behavior
- Nodemailer for SMTP delivery with retry handling
- Helmet, compression, rate limiting, validation, and structured logging for production hardening
- Jest, Supertest, jsdom, jest-axe, and Puppeteer Core for automated and browser verification
- Vercel serverless deployment

## How It Works

Express maps `/` and each supported locale route to one shared portfolio template. The locale registry in [`utils/i18n.js`](utils/i18n.js) selects the document language, writing direction, dictionary, canonical URL, hreflang links, and localized client messages. EJS renders the complete page on the server, while a nonce-authorized JSON payload supplies only the messages needed by browser interactions.

The contact form validates input in the browser and on the server. Valid submissions pass through rate limiting and the email service; temporary SMTP failures receive safe responses without exposing credentials or internal errors. The browser sends the current locale in `Accept-Language` and displays localized status messages.

## Local Development

Requirements:

- A current Node.js LTS release
- npm
- Google Chrome only when regenerating the Resume PDF

Install and start the application:

```bash
git clone https://github.com/saamaamr/portfolio.git
cd portfolio
npm install
cp .env.example .env
npm run build:css
npm start
```

Open `http://localhost:3000`. Use `npm run dev` for server auto-reload and run `npm run dev:css` separately when editing styles.

## Environment Variables

Copy [`.env.example`](.env.example) to `.env` and configure:

```env
PORT=3000
NODE_ENV=development
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=your-contact-email@example.com
LOG_LEVEL=info
```

The portfolio renders without SMTP credentials, but contact submissions return a temporary-service error until SMTP is configured. For Gmail, use an app password rather than an account password. Never commit `.env` or real credentials.

## Commands

| Command | Purpose |
| --- | --- |
| `npm start` | Start the application with Node.js |
| `npm run dev` | Start the development server with Nodemon |
| `npm run dev:server` | Start the same Nodemon server task explicitly |
| `npm run dev:css` | Watch and rebuild the Tailwind stylesheet |
| `npm run build:css` | Create the minified production stylesheet |
| `npm run vercel-build` | Run the stylesheet build used for deployment |
| `npm test -- --runInBand` | Run the full Jest suite with coverage serially |
| `npm run test:watch` | Run Jest in watch mode |
| `npm run generate-pdf` | Regenerate the Resume PDF using Chrome |

## Project Structure

```text
app.js                    Express application, middleware, CSP, and error handling
server.js                 Process startup and graceful shutdown
routes/index.js           Portfolio locale routes and contact endpoint
services/email.js         SMTP transport, retry behavior, and email templates
utils/i18n.js             Locale registry, translation lookup, and page context
utils/                     Validation, API responses, logging, and error utilities
locales/                   Complete JSON dictionaries sharing one key contract
views/                     EJS pages and reusable partials
public/css/input.css      Source styles, responsive rules, and RTL overrides
public/css/output.css     Generated minified production stylesheet
public/js/                Theme, menus, forms, animation, and canvas behavior
public/resume.html        Printable Resume source
public/sitemap.xml        Search-engine routes for every supported language
scripts/generate-pdf.js   Resume PDF generation
tests/                     Route, service, UI, localization, and accessibility tests
swagger.json              OpenAPI documentation for the portfolio and contact API
vercel.json               Vercel serverless routing configuration
```

## Contact API

`POST /contact` accepts JSON or form data:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "I would like to discuss a technical support opportunity."
}
```

Validation limits are 100 characters for `name`, 254 characters for `email`, and 20–5000 characters for `message`. Requests are limited to 10 KB and may include `Accept-Language: en-US|bn|hi|ar|es|fr`. See [`swagger.json`](swagger.json) for request schemas and success, validation, rate-limit, payload-limit, service-unavailable, and server-error responses.

## Quality and Verification

The current implementation has been verified with:

- 61 automated tests across 8 suites
- 12 browser combinations covering all 6 locales at desktop and mobile widths
- Accessibility coverage through jest-axe, semantic document tests, and keyboard interaction tests
- A successful minified production CSS build
- Zero vulnerabilities in the latest full npm dependency audit
- Canonical, hreflang, sitemap, RTL, responsive-overflow, localized-validation, and Content Security Policy checks

## Deployment

Vercel runs [`app.js`](app.js) as the serverless handler through [`vercel.json`](vercel.json). The `vercel-build` script compiles the production stylesheet before deployment. Configure the SMTP and contact variables in the Vercel project environment before enabling live form delivery.

After deployment, verify `/`, all five translated routes, `/sitemap.xml`, and one contact submission using a non-sensitive test message.

## Translation Maintenance

All files in [`locales/`](locales/) must preserve the exact key structure defined by `locales/en-US.json`. Missing keys fall back to American English, but the automated localization tests require complete, non-empty dictionaries. Add new visible or accessibility text to every dictionary and keep client-only messages under the shared `client` object.

When adding another language, update the locale registry, Express route, sitemap, language selector, alternate links, tests, and this README together. Arabic is the only current RTL locale.

## Contributing

1. Create a focused branch from `main`.
2. Keep changes scoped and preserve localization, accessibility, and security behavior.
3. Run `npm run build:css`, `npm test -- --runInBand`, and `npm audit --audit-level=high`.
4. Confirm `git diff --check` succeeds before opening a pull request.
5. Describe visible changes and include browser evidence when modifying layouts.

## License

This project is available under the MIT License declared in `package.json`.
