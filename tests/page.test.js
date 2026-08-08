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

  it('presents a Technical Support Engineer identity and verified metrics', () => {
    const resumeLinks = [
      ...page.querySelectorAll('a[href="/Abdullah Al Mamun Resume.pdf"]'),
    ];

    expect(page.querySelector('[data-professional-role]').textContent.trim()).toBe(
      'Technical Support Engineer'
    );
    expect(page.querySelector('h1').textContent.trim()).toBe(
      'Clear support for people, software, and systems.'
    );
    expect(page.querySelector('[data-primary-cta]').getAttribute('href')).toBe(
      '#experience'
    );
    expect(page.querySelector('[data-primary-cta]').textContent.trim()).toContain(
      'View experience'
    );
    expect(resumeLinks).toHaveLength(2);
    expect([...page.querySelectorAll('[data-metric]')].map((node) => node.dataset.metric)).toEqual([
      'years',
      'github-history',
      'industries',
    ]);
    expect([...page.querySelectorAll('[data-metric] strong')].map((node) =>
      node.textContent.trim()
    )).toEqual(['7+', 'GitHub', '3']);
    const githubWork = page.querySelector('[data-github-history]');
    expect(githubWork.getAttribute('href')).toBe('https://github.com/saamaamr');
    expect(githubWork.getAttribute('target')).toBe('_blank');
    expect(githubWork.getAttribute('rel')).toBe('noopener noreferrer');
    expect(githubWork.getAttribute('aria-label')).toBe(
      "Explore Abdullah Al Mamun's projects and contributions on GitHub"
    );
    expect(githubWork.textContent).toContain('Projects and contributions');
    expect(githubWork.textContent).toContain('Explore my work');
    expect(githubWork.textContent).not.toContain('Since 2022');
    expect(githubWork.textContent).not.toContain('Public repository history');
    const facebookProfile = page.querySelector(
      '.hero-socials a[href="https://www.facebook.com/saamaamr1"]'
    );
    expect(facebookProfile).not.toBeNull();
    expect(facebookProfile.getAttribute('target')).toBe('_blank');
    expect(facebookProfile.getAttribute('rel')).toBe('noopener noreferrer');
    expect(facebookProfile.textContent.trim()).toBe('Facebook');
    expect(page.querySelector('[data-metric="workstations"]')).toBeNull();
    expect(page.querySelector('[data-metric="portfolio-languages"]')).toBeNull();
    expect(page.body.textContent).not.toMatch(/50\+ workstations/i);
    expect(page.body.textContent).not.toMatch(/Résumé|résumé/);
    expect(page.body.textContent).toContain('Open to Technical Support opportunities');
  });

  it('presents portrait metadata as an accessible hero summary', () => {
    const hero = page.getElementById('home');
    const portrait = hero.querySelector('.portrait-frame img');
    const summary = hero.querySelector('.profile-summary');
    const rows = [...summary.querySelectorAll(':scope > div')];

    expect(page.querySelectorAll('h1')).toHaveLength(1);
    expect(portrait.getAttribute('alt')).toBeTruthy();
    expect(summary.tagName).toBe('DL');
    expect(rows).toHaveLength(3);
    expect(rows.map((row) => row.querySelector('dt').textContent.trim())).toEqual([
      'Based in',
      'Current role',
      'Focus',
    ]);
    expect(rows.every((row) => row.querySelector('dd').textContent.trim().length > 0)).toBe(true);
  });

  it('publishes the Instagram profile consistently across social surfaces', () => {
    const instagramUrl = 'https://www.instagram.com/m_a_a_mamun';
    const heroLink = page.querySelector(`.hero-socials a[href="${instagramUrl}"]`);
    const footerLink = page.querySelector(`.footer-links a[href="${instagramUrl}"]`);
    const contactLink = page.querySelector(`.contact-panel a[href="${instagramUrl}"]`);
    const profileData = JSON.parse(
      page.querySelector('script[type="application/ld+json"]').textContent
    );

    [heroLink, footerLink, contactLink].forEach((link) => {
      expect(link).not.toBeNull();
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    });
    expect(heroLink.textContent.trim()).toBe('Instagram');
    expect(footerLink.getAttribute('aria-label')).toBe('Instagram');
    expect(contactLink.textContent).toContain('Instagram');
    expect(contactLink.textContent).toContain('@m_a_a_mamun');
    expect(profileData.sameAs).toContain(instagramUrl);
  });

  it('uses the approved support-first information architecture', () => {
    const sectionIds = [...page.querySelectorAll('main > section[id]')].map(
      (section) => section.id
    );

    expect(sectionIds).toEqual([
      'home',
      'capabilities',
      'experience',
      'approach',
      'evidence',
      'skills',
      'education',
      'contact',
    ]);
  });

  it('renders the profile strip as four semantic, scannable groups', () => {
    const strip = page.querySelector('.profile-strip.reveal');
    const groups = [...strip.querySelectorAll(':scope > .profile-strip-item')];
    const languageRows = [...strip.querySelectorAll('.language-row')];

    expect(strip.getAttribute('aria-label')).toBe(
      'Availability, location, languages, and interests'
    );
    expect(groups).toHaveLength(4);
    expect(groups.map((group) => group.querySelector('h3').textContent.trim())).toEqual([
      'Availability',
      'Location',
      'Languages',
      'Interests',
    ]);
    expect(strip.querySelector('.availability-status').textContent.trim()).toBe(
      'Open to remote opportunities'
    );
    expect(strip.querySelector('.status-dot').getAttribute('aria-hidden')).toBe('true');
    expect(strip.querySelector('address.profile-location').textContent.trim()).toBe(
      'Sandwip, Chattogram, Bangladesh'
    );
    expect(languageRows.map((row) => row.querySelector('dt').textContent.trim())).toEqual([
      'Bangla',
      'English',
    ]);
    expect(languageRows.map((row) => row.querySelector('.language-level').textContent.trim())).toEqual([
      'Fluent',
      'Good',
    ]);
    expect([...strip.querySelectorAll('.interest-list li')].map((item) =>
      item.textContent.trim()
    )).toEqual(['Travelling', 'Gardening', 'Cycling', 'Photography']);
    expect(strip.querySelector('a, button, input')).toBeNull();
  });

  it('renders three ordered primary repositories and one collaborative contribution', () => {
    const cards = [...page.querySelectorAll('[data-evidence-card]')];
    const links = [...page.querySelectorAll('[data-evidence-source]')];
    const contribution = page.querySelector('[data-collaborative-contribution]');

    expect(cards.map((card) => card.dataset.evidence)).toEqual([
      'noor-notes',
      'emergency-medicine-finder',
      'house-shifting-services',
    ]);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      'https://github.com/saamaamr/noor-notes',
      'https://github.com/saamaamr/emergency-medicine-finder',
      'https://github.com/saamaamr/house-shifting-services',
    ]);
    expect(contribution.textContent).toContain('PCIU CGPA Calculator');
    expect(contribution.textContent).toContain('Collaborative contribution');
    expect(contribution.querySelector('[data-contribution-source]').getAttribute('href')).toBe(
      'https://github.com/saamaamr/pciu-cgpa-calculator'
    );
    expect(page.querySelector('[data-private-evidence]')).toBeNull();
    expect(page.querySelector('[data-collaborative-evidence]').textContent).toContain(
      'Collaborative work'
    );
    expect(page.getElementById('evidence').textContent).toContain('Developer Evidence');
    expect(page.getElementById('evidence').textContent).not.toContain(
      'Smart Attendance Tracker'
    );
  });

  it('uses local, truthful visuals for every evidence card', () => {
    const images = [...page.querySelectorAll('[data-evidence-card] img')];
    const expectedSources = [
      '/assets/evidence/noor-notes-library.png',
      '/assets/evidence/emergency-supportability.svg',
      '/assets/evidence/house-shifting-collaboration.svg',
    ];

    expect(images.map((image) => image.getAttribute('src'))).toEqual(expectedSources);
    images.forEach((image) => {
      expect(image.getAttribute('alt').trim()).not.toBe('');
      expect(image.getAttribute('loading')).toBe('lazy');
    });
    expectedSources.forEach((source) => {
      expect(fs.existsSync(path.join(__dirname, '..', 'public', source))).toBe(true);
    });
    expect(page.documentElement.innerHTML).not.toContain('images.unsplash.com');
  });

  it('does not inflate positioning, ownership, outcomes, or readiness', () => {
    const text = page.body.textContent.replace(/\s+/g, ' ');

    expect(text).not.toMatch(/Web Developer|Full[- ]Stack Developer/i);
    expect(text).not.toMatch(
      /improved support team response|24\/7|minimized downtime|optimized outcomes/i
    );
    expect(text).not.toMatch(/\bis deployment[- ]ready\b|\bproduction[- ]ready system\b/i);
    expect(text).toContain('production-grade feature scope');
    expect(text).toContain('not presented as deployment-ready');
    expect(text).toContain('collaborative work');
    expect(text).toContain('PCIU CGPA Calculator');
    expect(text).not.toContain('Smart Attendance Tracker');
    expect(page.querySelector('.collaborative-note')).toBeNull();
    expect(page.querySelector('.contribution-note')).not.toBeNull();
  });

  it('keeps localized dates, recruiter-focused education, and current contact methods', async () => {
    const banglaPage = await renderPortfolio('bn');
    const navTargets = [...page.querySelectorAll('.desktop-nav [data-section]')].map(
      (link) => link.dataset.section
    );

    expect(navTargets).toEqual([
      'home',
      'experience',
      'approach',
      'evidence',
      'skills',
      'contact',
    ]);
    expect(page.body.textContent).toContain('May 2025 — Present');
    expect(banglaPage.body.textContent).not.toContain('May 2025 — Present');
    expect(page.querySelector('[data-education="bachelor"] strong').textContent.trim()).toBe(
      'GPA 3.76 / 4.00'
    );
    expect(page.querySelector('[data-education="diploma"] strong')).toBeNull();
    expect(page.querySelector('a[href="mailto:mamun872381cpi@gmail.com"]')).not.toBeNull();
    expect(page.querySelector('a[href="tel:+8801580831003"]')).not.toBeNull();
    expect(page.querySelector('a[href="https://wa.me/8801827918142"]')).not.toBeNull();
    expect(page.querySelector('a[href*="linkedin.com/in/abdullah"]')).not.toBeNull();
    const facebookMessage = page.querySelector(
      '.contact-panel a[href="https://m.me/saamaamr1"]'
    );
    expect(facebookMessage).not.toBeNull();
    expect(facebookMessage.getAttribute('target')).toBe('_blank');
    expect(facebookMessage.getAttribute('rel')).toBe('noopener noreferrer');
    expect(facebookMessage.textContent).toContain('Facebook Messenger');
    expect(facebookMessage.textContent).toContain('Send a message');
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

  it('renders theme-aware brand and favicon assets', () => {
    const logos = [...page.querySelectorAll('.brand-mark img')];

    expect(page.querySelector('.brand-name').textContent).toBe('Abdullah Al Mamun');
    expect(logos.map((logo) => logo.getAttribute('src'))).toEqual([
      '/assets/logo-light.svg',
      '/assets/logo-dark.svg',
    ]);
    logos.forEach((logo) => {
      expect(logo.getAttribute('alt')).toBe('');
      expect(logo.getAttribute('width')).toBe('36');
      expect(logo.getAttribute('height')).toBe('36');
    });
    expect(page.getElementById('site-favicon').getAttribute('href')).toBe(
      '/assets/logo-light.svg'
    );
    expect(page.querySelector('link[rel="apple-touch-icon"]').getAttribute('href')).toBe(
      '/assets/logo-light.svg'
    );
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
    expect(css).toContain('.brand-logo-dark');
    expect(css).toContain('.dark .brand-logo-light');
    expect(css).toContain('.brand-name');
    expect(css).toContain('.hero-proof-grid');
    expect(css).toContain('.approach-grid');
    expect(css).toContain('.evidence-grid');
    expect(css).toContain('.evidence-limitations');
    expect(css).toContain('.collaborative-badge');
    expect(css).toContain('.contribution-note');
    expect(css).not.toContain('.private-badge');
    expect(css).not.toContain('.collaborative-note');
    expect(css).toContain('.timeline-content');
  });
});
