import locales from "./locales";
import Translator from "./Translator";

export default {
  Translator,
  locales
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