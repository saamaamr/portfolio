# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-01-15

### Added
- **Security**: Helmet.js for HTTP security headers
- **Security**: XSS protection with xss library
- **Logging**: Structured logging with Winston
- **Validation**: Email validation with email-validator library
- **Performance**: Gzip compression middleware
- **Performance**: Static asset caching (1 day)
- **Email**: Retry logic with exponential backoff for email sending
- **Email**: SMTP connection pooling
- **Error Handling**: Centralized error handling middleware
- **Error Handling**: Async route wrapper for consistent error handling
- **API**: Standardized JSON response format across all endpoints
- **API**: Swagger/OpenAPI documentation (swagger.json)
- **Testing**: Jest test suite with basic validation and route tests
- **Frontend**: Client-side form validation before submission
- **Frontend**: Real-time validation feedback on blur
- **Accessibility**: Enhanced ARIA labels and roles
- **Accessibility**: Mobile menu aria-hidden management
- **Mobile**: Prevent body scroll when mobile menu is open
- **Mobile**: Better mobile menu close with keyboard (Escape)
- **Documentation**: .env.example with comprehensive documentation
- **Documentation**: CONTRIBUTING.md for development guidelines
- **Documentation**: CHANGELOG.md for version tracking

### Improved
- **Validation**: Better input length validation for all fields
- **Routes**: Standardized HTTP status codes and response formats
- **Email**: Better error handling and logging in email service
- **Navbar**: Added aria-current attribute for accessibility
- **Navbar**: Enhanced button titles and accessibility labels
- **Form**: Better error message display with role="alert"
- **Logging**: Request logging middleware for all routes
- **Security**: Environment variable validation at startup
- **Security**: Limited payload size (10kb max)

### Changed
- **Logger**: Replaced console.log with Winston logger throughout
- **Response Format**: All API responses now include timestamp
- **Error Messages**: More consistent and user-friendly error messages
- **Mobile Menu**: Now manages aria-hidden state properly

### Security
- Validates all environment variables at startup
- XSS protection on all user inputs
- HTTPS headers via Helmet.js
- Rate limiting on contact form (5 requests per 15 minutes)
- Payload size limits to prevent abuse
- Proper error handling without exposing stack traces in production

## [1.0.3] - Previous Release

### Features
- Express.js portfolio website
- EJS templating with responsive design
- Tailwind CSS v4 styling
- Contact form with email integration
- PDF resume generation with Puppeteer
- Mobile-first responsive layout
- Light/dark mode support
- Smooth animations with GSAP

---

## Migration Guide from v1.0.3 to v1.1.0

### Environment Variables
Add the following to your `.env` file:
```
LOG_LEVEL=info
```

### New Dependencies
Run `npm install` to install new packages:
- compression
- helmet
- winston
- xss
- email-validator
- jest & supertest (dev)

### Testing
New test suite available. Run with:
```bash
npm test
```

### Breaking Changes
None - this release is backward compatible.

---

For detailed API documentation, see [swagger.json](./swagger.json).
For development guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).
