# Abdullah Al Mamun — Portfolio

A responsive portfolio for a Technical Support Engineer with experience in website maintenance, IT operations, troubleshooting, and full-stack development.

Production: [mamunsandwipi.vercel.app](https://mamunsandwipi.vercel.app)

## What it includes

- Résumé-first hero and clear employer-focused positioning
- Capability, experience, selected project, skills, education, and contact sections
- Light/dark themes with saved preference and system-theme fallback
- Accessible keyboard navigation, skip link, focus management, and reduced-motion support
- Lightweight reveal, counter, typewriter, and ambient canvas effects
- Responsive layouts for desktop, tablet, and mobile
- Contact API with client/server validation, rate limiting, SMTP retry logic, and safe error responses
- Helmet security headers with a nonce-based Content Security Policy
- Branded 404 page, social card, structured data, sitemap, and robots file
- HTML résumé with generated PDF output

## Stack

- Node.js and Express
- EJS templates
- Tailwind CSS v4 and custom CSS
- Vanilla JavaScript
- Nodemailer
- Jest, Supertest, jsdom, and jest-axe
- Puppeteer Core for PDF generation

## Local setup

Requirements: a current Node.js LTS release, npm, and Google Chrome only if regenerating the PDF.

```bash
npm install
cp .env.example .env
npm run build:css
npm start
```

The site is available at `http://localhost:3000` by default.

For server auto-reload:

```bash
npm run dev
```

For CSS watch mode, run this separately:

```bash
npm run dev:css
```

## Environment

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

The portfolio renders without SMTP credentials, but contact submissions return a temporary-service error until SMTP is configured. Keep real credentials out of source control.

## Commands

| Command | Purpose |
| --- | --- |
| `npm start` | Start the production-style server |
| `npm run dev` | Start the server with Nodemon |
| `npm run dev:css` | Watch and rebuild CSS |
| `npm run build:css` | Create minified production CSS |
| `npm test -- --runInBand` | Run the full test suite with coverage |
| `npm run generate-pdf` | Regenerate the résumé PDF from `public/resume.html` |

## Project structure

```text
app.js                 Express application, middleware, and routing
server.js              Process startup and graceful shutdown
routes/index.js        Portfolio and contact routes
services/email.js      SMTP transport, retry, and email templates
utils/                 Validation, responses, logging, and errors
views/                  EJS page templates and partials
public/css/input.css   Source styles
public/css/output.css  Generated production styles
public/js/             Theme, interaction, and canvas scripts
public/resume.html     Printable résumé source
tests/                  API, service, frontend, page, and a11y tests
swagger.json           OpenAPI contact endpoint specification
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

Limits are 100 characters for the name, 254 for the email, and 20–5000 for the message. The full schema and response formats are documented in `swagger.json`.

## Deployment

Vercel uses `app.js` as the serverless handler and runs `npm run build:css` during deployment. Add the SMTP variables in the deployment environment before enabling the contact form.

## License

MIT
