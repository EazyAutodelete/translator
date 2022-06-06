import { readdirSync, readFileSync } from "fs";
import path from "path";
import locales from "./locales";
import { parse } from "json5";
import { TranslatorConfig } from ".";

export default class Translator {
  locales: string[];
  data: Record<string, Record<string, string | Record<string, string>>> = { en: {} };
  config: TranslatorConfig;

  constructor(config: TranslatorConfig) {
    this.locales = locales;
    this.config = config;
  }

  public translate(message: string, language: string, ...args: string[]): string | null {
    let translated: any = this.data[language] || this.data[this.config.defaultLocale];
    message.split(".").map(x => {
      translated = translated?.[x];
    });
    if (!translated || typeof translated != "string") return null;

    args.map(x => {
      translated = translated.replace("%s", x);
    });

    return translated;
  }

  public async loadMessages() {
    for await (const file of readdirSync(path.join(__dirname, "locales"))) {
      this.data[file.replace(".json5", "")] = await parse(
        readFileSync(path.join(__dirname, "locales", file), { encoding: "utf-8" })
      );
    }
  }

  public getLocales() {
    return this.config.locales;
  }
}
