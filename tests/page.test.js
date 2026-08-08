/** @jest-environment jsdom */

const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const { axe, toHaveNoViolations } = require('jest-axe');
const { buildPageContext } = require('../utils/i18n');

expect.extend(toHaveNoViolations);

const renderPortfolio = async (locale = 'en-US') => {
  const html = await ejs.renderFile(
    path.join(__dirname, '..', 'views', 'index.ejs'),
    buildPageContext(locale, { cspNonce: 'test-nonce' })
  );
  return new DOMParser().parseFromString(html, 'text/html');
};

describe('Portfolio document', () => {
  let page;

  beforeEach(async () => {
    page = await renderPortfolio();
  });

  it('offers skip navigation before every other interactive control', () => {
    const interactive = page.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    expect(interactive[0].id).toBe('skip-to-content');
  });

  it('presents a stable support-focused hero and primary resume action', () => {
    const resumeLinks = [
      ...page.querySelectorAll('a[href="/Abdullah Al Mamun Resume.pdf"]'),
    ];

    expect(page.querySelector('h1').textContent).toContain('Technical Support Engineer');
    expect(page.querySelector('[data-primary-cta]').getAttribute('href')).toBe(
      '/Abdullah Al Mamun Resume.pdf'
    );
    expect(resumeLinks.map((link) => link.textContent.trim())).toEqual([
      'Resume',
      'Download Resume',
      'Download Resume',
    ]);
    expect(page.body.textContent).not.toMatch(/Résumé|résumé/);
    expect(page.body.textContent).toContain('Open to discussions');
  });

  it('uses the approved streamlined information architecture', () => {
    const sectionIds = [...page.querySelectorAll('main > section[id]')].map(
      (section) => section.id
    );

    expect(sectionIds).toEqual([
      'home',
      'capabilities',
      'experience',
      'projects',
      'skills',
      'education',
      'contact',
    ]);
  });

  it('shows three permanently available source-code actions', () => {
    const projectCards = page.querySelectorAll('[data-project-card]');
    const sourceLinks = page.querySelectorAll('[data-project-source]');

    expect(projectCards).toHaveLength(3);
    expect(sourceLinks).toHaveLength(3);
    sourceLinks.forEach((link) => {
      expect(link.closest('[data-project-card]')).not.toBeNull();
      expect(link.closest('[aria-hidden="true"]')).toBeNull();
    });
  });

  it('provides native constraints and field-specific error destinations', () => {
    const expectations = {
      name: { maxlength: '100', autocomplete: 'name' },
      email: { maxlength: '254', autocomplete: 'email' },
      message: { minlength: '20', maxlength: '5000' },
    };

    Object.entries(expectations).forEach(([name, attributes]) => {
      const field = page.querySelector(`[name="${name}"]`);
      const error = page.getElementById(`${name}-error`);
      expect(field).not.toBeNull();
      expect(error).not.toBeNull();
      expect(field.getAttribute('aria-describedby')).toContain(`${name}-error`);
      Object.entries(attributes).forEach(([attribute, value]) => {
        expect(field.getAttribute(attribute)).toBe(value);
      });
    });
  });

  it('uses canonical metadata without blocked inline executable scripts', () => {
    expect(page.querySelector('link[rel="canonical"]').href).toBe(
      'https://mamunsandwipi.vercel.app/'
    );
    expect(page.querySelector('meta[property="og:image"]')).not.toBeNull();
    expect(page.querySelector('script[src="/js/theme-init.js"]')).not.toBeNull();
    expect(page.querySelector('script#locale-data[type="application/json"]')).not.toBeNull();
    expect(page.querySelector('script[src*="gsap"]')).toBeNull();
    expect(
      page.querySelector('script:not([src]):not([type="application/ld+json"]):not([type="application/json"])')
    ).toBeNull();
  });

  it('renders six language routes and marks American English as selected', () => {
    const links = page.querySelectorAll('[data-language-option]');

    expect(links).toHaveLength(6);
    expect(page.querySelector('[data-language-option][aria-current="page"]').getAttribute('href')).toBe('/');
  });

  it('renders locale canonical and complete hreflang alternates', async () => {
    const banglaPage = await renderPortfolio('bn');

    expect(banglaPage.querySelector('link[rel="canonical"]').getAttribute('href')).toBe(
      'https://mamunsandwipi.vercel.app/bn'
    );
    expect(banglaPage.querySelectorAll('link[rel="alternate"][hreflang]')).toHaveLength(7);
    expect(banglaPage.querySelector('link[hreflang="x-default"]').getAttribute('href')).toBe(
      'https://mamunsandwipi.vercel.app/'
    );
  });

  it('uses a real canvas for the ambient background', () => {
    expect(page.getElementById('bg-canvas').tagName).toBe('CANVAS');
  });

  it('has no detectable automated accessibility violations', async () => {
    expect(await axe(page.body)).toHaveNoViolations();
  });

  it('renders an accessible Arabic document in RTL', async () => {
    const arabicPage = await renderPortfolio('ar');

    expect(arabicPage.documentElement.getAttribute('lang')).toBe('ar');
    expect(arabicPage.documentElement.getAttribute('dir')).toBe('rtl');
    expect(arabicPage.body.textContent).toContain('دعم يصل بين الناس والتقنية');
    expect(await axe(arabicPage.body)).toHaveNoViolations();
  });

  it('publishes all locale routes in the sitemap', () => {
    const sitemap = fs.readFileSync(
      path.join(__dirname, '..', 'public', 'sitemap.xml'),
      'utf8'
    );

    ['/', '/bn', '/hi', '/ar', '/es', '/fr'].forEach((route) => {
      const url = route === '/'
        ? 'https://mamunsandwipi.vercel.app/'
        : `https://mamunsandwipi.vercel.app${route}`;
      expect(sitemap).toContain(`<loc>${url}</loc>`);
    });
  });

  it('includes responsive language-menu and RTL layout rules', () => {
    const css = fs.readFileSync(
      path.join(__dirname, '..', 'public', 'css', 'input.css'),
      'utf8'
    );

    expect(css).toContain('.language-menu');
    expect(css).toContain('[dir="rtl"]');
  });
});
