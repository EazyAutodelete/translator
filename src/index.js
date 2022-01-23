const path = require('path');
const { I18n, __ } = require('i18n');

const locales = require("./locales.js");

const Translator = new I18n({
  locales: ["en","de"], // locales,
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'en',
  fallbacks: { '*': 'en' },
  retryInDefaultLocale: true,
  autoReload: true,
});

module.exports = {
  Translator,
  locales,
  translate: Translator.__
};