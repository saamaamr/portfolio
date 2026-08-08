/** @jest-environment jsdom */

describe('Portfolio browser behavior', () => {
  let portfolio;

  beforeEach(() => {
    jest.resetModules();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    window.localStorage.clear();
    portfolio = require('../public/js/script');
  });

  it('uses system preference until a visitor saves an explicit theme', () => {
    expect(portfolio.resolveTheme(null, true)).toBe('dark');
    expect(portfolio.resolveTheme(null, false)).toBe('light');
    expect(portfolio.resolveTheme('light', true)).toBe('light');
  });

  it('selects the favicon that matches the active theme', () => {
    document.head.innerHTML = '<link id="site-favicon" href="/assets/logo-light.svg">';

    portfolio.syncThemeFavicon(document, 'dark');
    expect(document.getElementById('site-favicon').getAttribute('href')).toBe(
      '/assets/logo-dark.svg'
    );
    portfolio.syncThemeFavicon(document, 'light');
    expect(document.getElementById('site-favicon').getAttribute('href')).toBe(
      '/assets/logo-light.svg'
    );
  });

  it('keeps the favicon synced through system and saved theme changes', () => {
    const mediaListeners = {};
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: jest.fn(() => ({
        matches: true,
        addEventListener: (type, listener) => {
          mediaListeners[type] = listener;
        },
      })),
    });
    document.head.innerHTML = '<link id="site-favicon" href="/assets/logo-light.svg">';
    document.body.innerHTML = '<button id="theme-toggle" type="button"></button>';

    portfolio.initTheme(document, {
      light: 'Switch to light mode',
      dark: 'Switch to dark mode',
    });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.getElementById('site-favicon').getAttribute('href')).toBe(
      '/assets/logo-dark.svg'
    );

    mediaListeners.change({ matches: false });
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.getElementById('site-favicon').getAttribute('href')).toBe(
      '/assets/logo-light.svg'
    );

    document.getElementById('theme-toggle').click();
    expect(window.localStorage.getItem('theme')).toBe('dark');
    expect(document.getElementById('site-favicon').getAttribute('href')).toBe(
      '/assets/logo-dark.svg'
    );

    mediaListeners.change({ matches: false });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.getElementById('site-favicon').getAttribute('href')).toBe(
      '/assets/logo-dark.svg'
    );
  });

  it('returns field-specific contact validation errors', () => {
    expect(
      portfolio.validateContactFields({
        name: '',
        email: 'not-an-email',
        message: 'Too short',
      })
    ).toEqual({
      name: 'Name is required.',
      email: 'Please enter a valid email address.',
      message: 'Message must be at least 20 characters long.',
    });
  });

  it('uses localized contact validation messages', () => {
    const messages = {
      nameRequired: 'আপনার নাম লিখুন।',
      emailRequired: 'আপনার ইমেইল লিখুন।',
      messageRequired: 'আপনার বার্তা লিখুন।',
    };

    expect(
      portfolio.validateContactFields({ name: '', email: '', message: '' }, messages)
    ).toEqual({
      name: messages.nameRequired,
      email: messages.emailRequired,
      message: messages.messageRequired,
    });
  });

  it('parses nonce-authorized locale data and safely handles malformed JSON', () => {
    document.head.innerHTML = `
      <script id="locale-data" type="application/json">
        {"locale":"fr","typewriterPhrases":["maintenance web"],"form":{}}
      </script>
    `;

    expect(portfolio.parseLocaleData(document).locale).toBe('fr');
    document.getElementById('locale-data').textContent = '{broken';
    expect(portfolio.parseLocaleData(document)).toMatchObject({ locale: 'en-US', form: {} });
  });

  it('synchronizes visual and accessible active navigation state', () => {
    document.body.innerHTML = `
      <a class="nav-link active-nav" data-section="home" aria-current="location"></a>
      <a class="nav-link" data-section="experience"></a>
    `;
    const links = document.querySelectorAll('.nav-link');

    portfolio.setActiveNavigation(links, 'experience');

    expect(links[0].classList.contains('active-nav')).toBe(false);
    expect(links[0].hasAttribute('aria-current')).toBe(false);
    expect(links[1].classList.contains('active-nav')).toBe(true);
    expect(links[1].getAttribute('aria-current')).toBe('location');
  });

  it('returns focus to the trigger when an open mobile menu closes', () => {
    document.body.innerHTML = `
      <button id="trigger" aria-expanded="false"></button>
      <nav id="menu" aria-hidden="true"><a href="#home">Home</a></nav>
    `;
    const button = document.getElementById('trigger');
    const menu = document.getElementById('menu');
    const navigation = portfolio.initMobileMenu({ button, menu, documentRef: document });

    navigation.open();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(menu.getAttribute('aria-hidden')).toBe('false');

    navigation.close({ restoreFocus: true });
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(menu.getAttribute('aria-hidden')).toBe('true');
    expect(document.activeElement).toBe(button);
  });

  it('closes the language menu with Escape and returns focus', () => {
    document.body.innerHTML = `
      <button id="language-toggle" aria-expanded="false"></button>
      <div id="language-menu" hidden><a href="/bn">বাংলা</a></div>
    `;
    const button = document.getElementById('language-toggle');
    const menu = document.getElementById('language-menu');
    const languageMenu = portfolio.initLanguageMenu({ button, menu, documentRef: document });

    languageMenu.open();
    expect(menu.hidden).toBe(false);
    expect(button.getAttribute('aria-expanded')).toBe('true');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(menu.hidden).toBe(true);
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
  });
});
