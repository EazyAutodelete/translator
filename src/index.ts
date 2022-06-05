import locales from "./locales";
import path from "path";
import Translator from "./Translator";

const translator = new Translator({
  locales: locales,
  defaultLocale: "en"
});

export default {
  translator,
  locales,
  translate: translator.translate,
};

export type Locale =
| "en"
| "bg"
| "zh-CN"
| "zh-TW"
| "hr"
| "cs"
| "da"
| "nl"
| "fi"
| "fr"
| "de"
| "el"
| "hi"
| "hu"
| "it"
| "ja"
| "ko"
| "lt"
| "no"
| "pl"
| "pt"
| "ro"
| "ru"
| "es"
| "sv-SE"
| "th"
| "tr"
| "uk"
| "vi";