/** @jest-environment jsdom */

const path = require('path');
const ejs = require('ejs');
const { axe, toHaveNoViolations } = require('jest-axe');

expect.extend(toHaveNoViolations);

const renderPortfolio = async () => {
  const html = await ejs.renderFile(
    path.join(__dirname, '..', 'views', 'index.ejs'),
    { cspNonce: 'test-nonce' }
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
    expect(page.querySelector('h1').textContent).toContain('Technical Support Engineer');
    expect(page.querySelector('[data-primary-cta]').getAttribute('href')).toBe(
      '/Abdullah Al Mamun Resume.pdf'
    );
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
    expect(page.querySelector('script[src*="gsap"]')).toBeNull();
    expect(page.querySelector('script:not([src]):not([type="application/ld+json"])')).toBeNull();
  });

  it('uses a real canvas for the ambient background', () => {
    expect(page.getElementById('bg-canvas').tagName).toBe('CANVAS');
  });

  it('has no detectable automated accessibility violations', async () => {
    expect(await axe(page.body)).toHaveNoViolations();
  });
});
