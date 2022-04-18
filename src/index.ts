import locales from "./locales";
import path from "path";
import i18n from "i18n";

const Translator = new i18n.I18n();

Translator.configure({
  locales: locales, // locales,
  directory: path.join(__dirname, "locales"),
  defaultLocale: "en",
  fallbacks: { "*": "en" },
  retryInDefaultLocale: true,
  autoReload: true,
  objectNotation: true
});

export default {
  Translator,
  locales,
  translate: Translator.__,
};
