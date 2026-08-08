/** @jest-environment jsdom */

describe('Portfolio browser behavior', () => {
  let portfolio;

  beforeEach(() => {
    jest.resetModules();
    portfolio = require('../public/js/script');
  });

  it('uses system preference until a visitor saves an explicit theme', () => {
    expect(portfolio.resolveTheme(null, true)).toBe('dark');
    expect(portfolio.resolveTheme(null, false)).toBe('light');
    expect(portfolio.resolveTheme('light', true)).toBe('light');
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
});
