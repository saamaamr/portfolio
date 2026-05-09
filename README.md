# Abdullah Al Mamun — Portfolio

**Version:** 1.0.1

Full-stack web developer from Sandwip, Chattogram. I build complete web applications using Node.js, Express, MySQL, and modern JavaScript.

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript, EJS, Tailwind CSS, SCSS
- **Backend:** Node.js, Express.js, MySQL, JWT, bcrypt, REST APIs
- **Tools:** Git & GitHub, Vercel, Nodemailer, Postman

## Projects

- **Emergency Medicine Finder** — Full-stack web app with JWT auth, role-based dashboards (user/worker/admin), MySQL database, medicine search & service booking.
- **House Shifting Service** — Web application for managing house shifting services.
- **PCIU CG Calculator** — CGPA calculator for university students, deployed on Vercel.
- **This Portfolio** — Express/EJS portfolio with Tailwind CSS v4, GSAP animations, glassmorphism design, and a working contact form with auto-reply.

## Changelog

### v1.0.1 — 2026-05-09

#### Documentation
- Add environment variables reference table to README
- Document SMTP configuration and all configurable environment variables

### v1.0.0 — Initial Release

#### Features
- Migrate to Tailwind CSS v4 with light/dark mode and GSAP animations
- Digital Lavender glassmorphism design system
- Scroll-driven compact navbar with animated pill shrink and SVG logo
- Animated active link indicators and smooth mobile menu
- Professional resume PDF generation and download
- Contact form with auto-reply via Nodemailer
- Project cards linked to actual GitHub repositories
- Responsive layout across all device sizes

#### Fixes
- PDF title and header/footer cleanup
- Mobile responsiveness: hero section, image scaling, button stacking
- Navbar: mobile menu visibility and resize handling
- EADDRINUSE error handling in dev script
- Email address corrections

#### Maintenance
- Full code review: JS cleanup, CSS refinements, accessibility improvements
- Professional copy refinements across all sections
- Domain reference updates

## Setup

```bash
npm install
cp .env.example .env   # then edit with your credentials
npm run dev
```

Visit `http://localhost:3000`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SMTP_HOST` | Yes | SMTP server hostname (default: `smtp.gmail.com`) |
| `SMTP_PORT` | Yes | SMTP server port (default: `587`) |
| `SMTP_USER` | Yes | Gmail address for sending emails |
| `SMTP_PASS` | Yes | Gmail App Password (not your regular password) |
| `CONTACT_EMAIL` | No | Where contact form submissions are sent (defaults to `SMTP_USER`) |
| `PORT` | No | Server port (default: `3000`) |

See `.env.example` for a template.
