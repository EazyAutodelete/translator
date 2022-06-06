import loc from "./locales";
import Translator from "./Translator";

export default Translator;

export var locales = loc;

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

export interface TranslatorConfig {
  defaultLocale: Locale;
  locales: Locale[];
}