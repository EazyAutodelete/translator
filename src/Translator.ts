import { readdirSync, readFileSync, createWriteStream } from "fs";
import path from "path";
import axios from "axios";
import Logger from "@eazyautodelete/logger";

export default class Translator {
  locales: string[];
  data: { [index: string]: { [index: string]: string } } = { en: {} };
  defaultLocale: string;
  logger: Logger;
  token: string;

  constructor(token: string) {
    this.token = token;
    this.locales = [];
    this.defaultLocale = "en";
    this.logger = new Logger();
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
    this.logger.info(`Loaded ${this.locales.length} locales`, "I18N");

    await Promise.all(
      this.locales.map(async lang => {
        await this.loadLanguage(lang);
      })
    );

    const files = readdirSync(path.join(__dirname, "locales"));
    for (const file of files) {
      const locale = file.split(".")[0];
      const data = JSON.parse(readFileSync(path.join(__dirname, "locales", file), "utf8"));
      this.data[locale] = data;
    }

    this.logger.info(`Loaded Data for ${Object.keys(this.data).length} locales`, "I18N");
  }

  public async loadLanguage(language: string) {
    const result = await axios
      .get(`https://translate.eazyautodelete.xyz/api/translations/bot/commands/${language}/file/`, {
        headers: {
          Authorization: `Token ${this.token}`,
        },
        responseType: "stream",
      })
      .catch(console.error);

    if (!result || !result.data) return;

    const writer = createWriteStream(path.join(__dirname, "locales", `${language}.json`));

    result.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  }

  public async loadLocales() {
    const result = await axios
      .get("https://translate.eazyautodelete.xyz/api/projects/bot/languages/", {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      })
      .catch(console.error);

    if (!result || !result.data) return;

    const languageCodes = result.data.map((x: any) => x.code);

    this.locales = languageCodes;
    this.defaultLocale = "en";
  }

  public getLocales() {
    return this.locales;
  }
}
