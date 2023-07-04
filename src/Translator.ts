import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import axios from "axios";
import Logger from "@eazyautodelete/logger";

export default class Translator {
  locales: string[];
  data: { [index: string]: { [index: string]: string } } = { en: {} };
  defaultLocale: string;
  logger: Logger;
  token: string;
  languageNames: Map<string, string>;
  loadFromI18n: boolean;
  loadFromGit: boolean;

  constructor(token: string, Logger: Logger) {
    this.token = token;
    this.locales = [];
    this.defaultLocale = "en";
    this.logger = Logger;
    this.languageNames = new Map();
    this.loadFromI18n = true;
    this.loadFromGit = true;
  }

  public async reloadMessages() {
    await this.loadMessages();
  }

  public translate(message: string, language: string, ...args: string[]): string {
    let i18n = this.data?.[language]?.[message] || this.data[this.defaultLocale]?.[message];

    if (!i18n || typeof i18n != "string") return message;

    args.map(x => {
      i18n = i18n.replace("%s", x);
    });

    return i18n || message;
  }

  public async loadMessages() {
    await this.loadLocales();
    this.logger.info(`[🗯️] Loaded ${this.locales.length} locales`, "I18N");

    await Promise.all(
      this.locales.map(async lang => {
        await this.loadLanguage(lang);
      })
    );

    this.logger.info(`[🗯️] Loaded Data for ${Object.keys(this.data).length} locales`, "I18N");
  }

  public async loadLanguage(locale: string) {
    if (this.loadFromI18n) {
      const result = await axios
        .get(`https://translate.eazyautodelete.xyz/api/translations/bot/commands/${locale}/file/`, {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        })
        .catch(console.error);

      if (!result) return;

      if (!existsSync("./i18n")) mkdirSync("./i18n");
      writeFileSync(`./i18n/${locale}.json`, JSON.stringify(result, null, 2));

      const data = result.data;
      this.data[locale] = data;
    } else if (this.loadFromGit) {
      const result = await axios
        .get(`https://raw.githubusercontent.com/EazyAutodelete/translations/main/commands/${locale}.json`, {
          responseType: "json",
        })
        .catch(console.error);

      if (!result || !result.data) return;

      if (!existsSync("./i18n")) mkdirSync("./i18n");
      writeFileSync(`./i18n/${locale}.json`, JSON.stringify(result.data, null, 2));

      const data = result.data;
      this.data[locale] = data;
    } else {
      if (!existsSync("./i18n")) mkdirSync("./i18n");

      const file = existsSync(`./i18n/${locale}.json`) ? readFileSync(`./i18n/${locale}.json`).toString() : "{}";
      if (!file) return;

      const data = JSON.parse(file);
      this.data[locale] = data || {};
    }
  }

  public async loadLocales() {
    var result = [
      {
        code: "ar",
      },
      {
        code: "da",
      },
      {
        code: "de",
      },
      {
        code: "el",
      },
      {
        code: "en",
      },
      {
        code: "es",
      },
      {
        code: "fa",
      },
      {
        code: "fr",
      },
      {
        code: "ja",
      },
      {
        code: "nl",
      },
      {
        code: "pl",
      },
      {
        code: "pt_BR",
      },
      {
        code: "ro",
      },
      {
        code: "ru",
      },
      {
        code: "tr",
      },
    ];

    if (this.loadFromGit) {
      const req = await axios
        .get("https://api.github.com/repos/eazyautodelete/translations/contents/commands")
        .catch(() => null);

      if (!req || !req.data) this.loadFromGit = false;
      else result = req.data.map((x: any) => ({ code: x.name.replace(".json", "") }));
    }

    if (this.loadFromI18n) {
      const req = await axios
        .get("https://translate.eazyautodelete.xyz/api/projects/bot/languages/", {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        })
        .catch(() => null);

      if (!req || !req.data) this.loadFromI18n = false;
      else result = req.data;
    }

    const languageCodes = result.map(x => x.code);

    await Promise.all(result.map((x: any) => this.languageNames.set(x.code, x.language)));

    this.locales = languageCodes;
    this.defaultLocale = "en";
  }

  public getLocales() {
    return this.locales;
  }

  public getLanguageNames() {
    return this.languageNames;
  }

  public getDefaultLocale() {
    return this.defaultLocale;
  }

  public getLanguageName(code: string) {
    return this.languageNames.get(code);
  }

  public getLanguageCode(name: string) {
    return [...this.languageNames.entries()].find(([, v]) => v === name)?.[0];
  }

  public getLanguageNamesArray() {
    return [...this.languageNames.values()];
  }
}
