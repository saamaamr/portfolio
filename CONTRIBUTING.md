# Contributing to Portfolio

Thank you for your interest in contributing! This document outlines the process and guidelines for contributing to this project.

## Development Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure SMTP credentials for email functionality

### Running Development Server
```bash
npm run dev
```

This starts:
- Express server with automatic restart (nodemon)
- Tailwind CSS in watch mode

### Building Production CSS
```bash
npm run build:css
```

## Code Standards

### JavaScript
- Use ES6+ syntax
- Use async/await for async operations
- Add proper error handling with try-catch
- Avoid console.log in production code (use logger instead)

### Validation
- Always validate user input server-side
- Use the validation utilities in `/utils/validation.js`
- Sanitize HTML to prevent XSS attacks

### Security
- Never commit sensitive data (.env files)
- Always use HTTPS in production
- Keep dependencies updated
- Report security issues privately

## Testing

Run tests with:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

### Test Guidelines
- Write tests for new features
- Maintain >70% code coverage
- Test both success and error cases
- Use descriptive test names

## Submitting Changes

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes
3. Run tests and linting
4. Commit with clear messages:
```bash
git commit -m "Add: new feature description"
```

5. Push to your branch
6. Submit a Pull Request

### Commit Message Format
- `Add:` for new features
- `Fix:` for bug fixes
- `Improve:` for improvements
- `Refactor:` for code refactoring
- `Docs:` for documentation
- `Test:` for test-related changes

## Code Review Process

- All PRs require code review
- Address review comments promptly
- Keep discussions constructive
- Once approved, PRs can be merged

## Reporting Issues

Use GitHub Issues to report bugs. Please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Your environment (Node version, OS, etc.)

## Questions?

Feel free to open a discussion or contact:
- Email: mamun872381cpi@gmail.com
- LinkedIn: https://linkedin.com/in/abdullah-a-699a90117/

Thank you for contributing!
