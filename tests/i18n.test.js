const {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  getTranslator,
  getFlatKeys,
  getLocalePath,
  buildPageContext,
} = require('../utils/i18n');

const getLeafValues = (value) => Object.values(value).flatMap((entry) =>
  entry && typeof entry === 'object' && !Array.isArray(entry)
    ? getLeafValues(entry)
    : [entry]
);

describe('portfolio locale dictionaries', () => {
  it('defines the approved locale order and routes', () => {
    expect(DEFAULT_LOCALE).toBe('en-US');
    expect(SUPPORTED_LOCALES.map(({ code, path, dir }) => ({ code, path, dir }))).toEqual([
      { code: 'en-US', path: '/', dir: 'ltr' },
      { code: 'bn', path: '/bn', dir: 'ltr' },
      { code: 'hi', path: '/hi', dir: 'ltr' },
      { code: 'ar', path: '/ar', dir: 'rtl' },
      { code: 'es', path: '/es', dir: 'ltr' },
      { code: 'fr', path: '/fr', dir: 'ltr' },
    ]);
  });

  it.each(['bn', 'hi', 'ar', 'es', 'fr'])(
    '%s has the complete English key contract',
    (code) => {
      const english = require('../locales/en-US.json');
      const translated = require(`../locales/${code}.json`);

      expect(getFlatKeys(translated)).toEqual(getFlatKeys(english));
      expect(
        getLeafValues(translated).every((value) =>
          Array.isArray(value)
            ? value.length > 0
              && value.every((item) => typeof item === 'string' && item.trim())
            : typeof value === 'string' && value.trim()
        )
      ).toBe(true);
    }
  );

  it('falls back to American English for unsupported locales and missing keys', () => {
    expect(getTranslator('bn')('hero.title')).toBe('টেকনিক্যাল সাপোর্ট ইঞ্জিনিয়ার');
    expect(getTranslator('unsupported')('hero.title')).toBe('Technical Support Engineer');
    expect(getTranslator('bn')('missing.key')).toBe('missing.key');
  });

  it('builds safe locale paths and Arabic rendering context', () => {
    expect(getLocalePath('en-US')).toBe('/');
    expect(getLocalePath('fr')).toBe('/fr');
    expect(buildPageContext('ar')).toMatchObject({
      locale: 'ar',
      lang: 'ar',
      dir: 'rtl',
      canonicalUrl: 'https://mamunsandwipi.vercel.app/ar',
    });
  });

  it('serializes client messages without allowing script-tag termination', () => {
    const context = buildPageContext('en-US', {
      clientMessages: { unsafe: '</script><script>alert(1)</script>' },
    });

    expect(context.serializedClientMessages).not.toContain('</script>');
    expect(context.serializedClientMessages).toContain('\\u003c/script>');
  });
});
