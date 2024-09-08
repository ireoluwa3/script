require('dotenv').config();

const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en';
const locales = process.env.NEXT_PUBLIC_LANGUAGES ? process.env.NEXT_PUBLIC_LANGUAGES.split(',').map((lang) => lang.trim()) : ['en'];

module.exports = {
  i18n: {
    defaultLocale,
    locales,
  },
  debug: true,
  localePath: typeof window === 'undefined'
    ? require('path').resolve('./public/locales')
    : '/public/locales',
};
