# Abdullah Al Mamun — Portfolio

**Version:** 1.0.3

Personal portfolio website for Abdullah Al Mamun, built with Node.js, Express, EJS, Tailwind CSS v4, and modern frontend tooling.

## Overview

A responsive, full-featured portfolio and resume website showcasing web development skills and projects. The site features:
- Animated glassmorphism design with GSAP interactions
- Smooth scroll-driven UI with compact animated navbar
- Dynamic resume PDF generation (A4 format, optimized margins)
- Working contact form with SMTP email sending and auto-reply
- Server-side rendering with Express and EJS
- Mobile-first responsive layout

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript, EJS, Tailwind CSS v4, GSAP, WordPress
- **Backend:** Node.js, Express.js, Nodemailer, JWT, bcrypt
- **Database:** MySQL, MySQL2
- **Testing:** Jest, Supertest
- **PDF Generation:** Puppeteer Core (Chromium-based)
- **Dev Tools:** Tailwind CSS CLI, Nodemon, npm scripts

## Notable Projects

- **Emergency Medicine Finder** — Production-grade healthcare platform with 3 user roles (patient, medicine shop, admin), JWT authentication, 17-table MySQL relational schema, 82+ API routes, Multer file uploads, Nodemailer email verification, and parameterized SQL queries for injection prevention. Features medicine search, request workflows, pharmacy management (suppliers, purchases with batch/expiry tracking, sales with auto profit calculation, expenses, P&L reports), multi-shop stock transfers, daily automated database backups, data export (JSON/CSV), and a comprehensive Jest + Supertest test suite.
- **House Shifting Service** — Service management application for scheduling and coordinating relocations.
- **PCIU CG Calculator** — Student CGPA calculator deployed on Vercel.
- **This Portfolio** — Express/EJS portfolio with responsive design, PDF resume generation, contact form with auto-reply, and professional animations.

## Features

### Core Features
- Responsive portfolio landing page with hero, skills, services, and contact sections
- Scroll-driven animated navigation with compact pill-style design
- Professional resume PDF generation with optimized layout
- Contact form with validation, rate limiting, and SMTP email integration
- Auto-reply email system with HTML formatting and auto-escape security

### Design & UX
- Digital Lavender glassmorphism design system
- Light/dark mode support with theme toggle
- Smooth scroll behavior and GSAP-powered animations
- Mobile-first responsive layout
- Professional SVG logo in navbar

### Security & Performance
- Rate limiting middleware (5 submissions per 15 minutes)
- Input validation with field length limits
- HTML escaping in email templates to prevent XSS
- SMTP error handling with user-friendly messages
- Tailwind CSS v4 with production minification

## Available Scripts

```bash
npm install                # Install dependencies
npm run dev                # Start dev server + watch Tailwind CSS
npm run dev:css            # Watch Tailwind CSS only
npm run dev:kill           # Kill dev server and start fresh
npm run build:css          # Build minified CSS for production
npm run generate-pdf       # Generate resume PDF from HTML template
npm run vercel-build       # Build command for Vercel deployment
npm start                  # Start production server
```

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```

### 3. Update `.env` File
Configure SMTP settings and optional contact email address:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=your-email@gmail.com  # Optional, defaults to SMTP_USER
PORT=3000
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## Environment Variables Reference

| Variable | Required | Type | Default | Description |
|----------|----------|------|---------|-------------|
| `SMTP_HOST` | Yes | String | `smtp.gmail.com` | SMTP server hostname |
| `SMTP_PORT` | Yes | Number | `587` | SMTP server port |
| `SMTP_USER` | Yes | String | — | Gmail address used to send emails |
| `SMTP_PASS` | Yes | String | — | Gmail App Password (not regular password) |
| `CONTACT_EMAIL` | No | String | `SMTP_USER` | Email address for contact form submissions |
| `PORT` | No | Number | `3000` | Server port |

### Gmail Configuration
To use Gmail for sending emails:
1. Enable 2-factor authentication on your Google Account
2. Generate an App Password at https://myaccount.google.com/apppasswords
3. Use the generated 16-character password in `SMTP_PASS`

See `.env.example` for a template with all available variables.

## Project Structure

```
├── app.js                      # Express server setup and middleware
├── routes/
│   └── index.js               # Route handlers for GET / and POST /contact
├── middleware/
│   └── rateLimit.js           # Rate limiting middleware (5 per 15 min)
├── services/
│   └── email.js               # Nodemailer transporter and email functions
├── scripts/
│   └── generate-pdf.js        # Puppeteer script for PDF generation
├── views/
│   ├── index.ejs              # Main landing page template
│   └── partials/              # Navbar, head, footer components
├── public/
│   ├── css/                   # Tailwind CSS (input + compiled output)
│   ├── js/                    # Client-side scripts and animations
│   └── resume.html            # Resume template for PDF generation
└── package.json               # Dependencies and scripts
```

## Contact Form Flow

1. User submits form via POST `/contact`
2. Server validates input (length, format, message minimum)
3. Rate limiter checks submission count
4. Contact notification sent to configured email
5. Auto-reply sent to user
6. Success message returned to client

## PDF Resume Generation

Run the PDF generator to create a polished resume:
```bash
npm run generate-pdf
```

- Generates from `public/resume.html`
- Outputs to `public/Abdullah Al Mamun Resume.pdf`
- A4 format with 5mm top/bottom, 8mm left/right margins
- Preserves all styling and formatting

## Deployment

### Vercel Deployment
The project is configured for Vercel deployment with a build script:
```bash
npm run vercel-build  # Builds optimized CSS
```

### General Deployment
1. Build CSS: `npm run build:css`
2. Generate PDF: `npm run generate-pdf`
3. Set environment variables on hosting platform
4. Run: `npm start`

## Recent Updates (v1.0.3)

- Refactored styles and animations for improved UX
- Added contact phone numbers to resume and portfolio
- Expanded IT Support Technician certification details
- Enhanced contact form validation and error handling
- Optimized PDF margins and layout
- Improved email auto-reply HTML formatting
- Added "Full-Stack Developer" to typed text roles
- Expanded skills with express-validator, Multer, node-cron, WordPress, GSAP, Jest, Supertest, Puppeteer
- Updated Emergency Medicine Finder project description with detailed features
- Added tech icons for WordPress, Jest, bcrypt, and GSAP in frontend
- Updated technologies count from 10 to 15

## License

MIT License
