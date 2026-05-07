# Abdullah Al Mamun Portfolio

A clean, responsive personal portfolio website built with Node.js, Express.js, HTML, CSS, and JavaScript.

## Project Structure

- `app.js` - Main Express server entry point.
- `package.json` - Project dependencies and start scripts.
- `routes/index.js` - Express route definitions.
- `views/` - EJS templates for the website pages.
- `public/css/` - Custom stylesheet.
- `public/js/` - Client-side JavaScript.
- `public/assets/` - Static assets folder.

## Features

- Home section with hero call-to-action
- About, Skills, Services, Projects, and Contact sections
- Responsive layout for desktop and mobile
- Navigation menu with mobile toggle
- Working contact form with server-side handling
- Clean modern design and semantic markup

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run in development mode:

```bash
npm run dev
```

3. Open your browser at:

```bash
http://localhost:3000
```

## Production

Start the server with:

```bash
npm start
```

## Troubleshooting

- Make sure Node.js and npm are installed on your machine. Verify with `node -v` and `npm -v`.
- If the server does not start, confirm Node.js is installed by running `node -v`.
- If `npm install` fails, delete `node_modules` and `package-lock.json`, then run `npm install` again.
- If styles or scripts are missing, verify that `public/css/style.css` and `public/js/script.js` exist and are referenced as `/css/style.css` and `/js/script.js`.
- If the contact form does not submit, check the browser console and the terminal output for validation errors.

## Notes

- Contact form submissions are logged to the server console.
- The project is designed to be beginner-friendly and easy to extend.
