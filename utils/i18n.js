const english = require('../locales/en-US.json');
const bangla = require('../locales/bn.json');
const hindi = require('../locales/hi.json');
const arabic = require('../locales/ar.json');
const spanish = require('../locales/es.json');
const french = require('../locales/fr.json');

const DEFAULT_LOCALE = 'en-US';
const BASE_URL = 'https://mamunsandwipi.vercel.app';

const SUPPORTED_LOCALES = [
  { code: 'en-US', path: '/', lang: 'en-US', dir: 'ltr', nativeName: 'English (US)' },
  { code: 'bn', path: '/bn', lang: 'bn', dir: 'ltr', nativeName: 'বাংলা' },
  { code: 'hi', path: '/hi', lang: 'hi', dir: 'ltr', nativeName: 'हिन्दी' },
  { code: 'ar', path: '/ar', lang: 'ar', dir: 'rtl', nativeName: 'العربية' },
  { code: 'es', path: '/es', lang: 'es', dir: 'ltr', nativeName: 'Español' },
  { code: 'fr', path: '/fr', lang: 'fr', dir: 'ltr', nativeName: 'Français' },
];

const dictionaries = {
  'en-US': english,
  bn: bangla,
  hi: hindi,
  ar: arabic,
  es: spanish,
  fr: french,
};

const getFlatKeys = (value, prefix = '') => Object.entries(value)
  .flatMap(([key, entry]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return entry && typeof entry === 'object' && !Array.isArray(entry)
      ? getFlatKeys(entry, path)
      : [path];
  })
  .sort();

const readKey = (source, key) => key
  .split('.')
  .reduce((value, part) => value?.[part], source);

const getLocale = (code) => SUPPORTED_LOCALES.find((locale) => locale.code === code)
  || SUPPORTED_LOCALES[0];

const getLocalePath = (code) => getLocale(code).path;

const getTranslator = (code) => {
  const dictionary = dictionaries[getLocale(code).code];
  return (key) => readKey(dictionary, key) ?? readKey(english, key) ?? key;
};

const getAlternateLinks = () => [
  ...SUPPORTED_LOCALES.map((locale) => ({
    hreflang: locale.lang,
    href: `${BASE_URL}${locale.path === '/' ? '/' : locale.path}`,
  })),
  { hreflang: 'x-default', href: `${BASE_URL}/` },
];

const getClientMessages = (code) => ({
  locale: getLocale(code).code,
  ...dictionaries[getLocale(code).code].client,
});

const serializeClientMessages = (messages) => JSON.stringify(messages).replace(/</g, '\\u003c');

const buildPageContext = (code = DEFAULT_LOCALE, overrides = {}) => {
  const selected = getLocale(code);
  const clientMessages = overrides.clientMessages || getClientMessages(selected.code);
  const context = {
    locale: selected.code,
    lang: selected.lang,
    dir: selected.dir,
    t: getTranslator(selected.code),
    languages: SUPPORTED_LOCALES,
    canonicalUrl: `${BASE_URL}${selected.path === '/' ? '/' : selected.path}`,
    alternateLinks: getAlternateLinks(),
    clientMessages,
    serializedClientMessages: serializeClientMessages(clientMessages),
  };

  return {
    ...context,
    ...overrides,
    clientMessages,
    serializedClientMessages: serializeClientMessages(clientMessages),
  };
};

module.exports = {
  BASE_URL,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  buildPageContext,
  getAlternateLinks,
  getClientMessages,
  getFlatKeys,
  getLocale,
  getLocalePath,
  getTranslator,
};
