import { Scraper } from "@/app/lib/scrapers/definitions";
import puppeteer from "puppeteer";
import cheerio from "cheerio";
import fs from "node:fs";

export default class PixivScraper implements Scraper {
  url: string;
  constructor(url: string) {
    this.url = url;
  }

  // async #getHtml() {
  //   const browser = await puppeteer.connect({
  //     browserWSEndpoint: `ws://localhost:3000?token=${process.env.BROWSERLESS_TOKEN}`,
  //   });

  //   const page = await browser.newPage();

  //   await page.goto(this.url, {
  //     waitUntil: "networkidle2",
  //   });

  //   const html = await page.content();
  //   await browser.close();
  //   return html;
  // }

  async #getHtml() {
    return fs.readFileSync(
      process.cwd() + "/src/app/lib/scrapers/pixivHtml.txt",
      "utf8"
    );
  }

  #scrapeHelper(html: string) {
    // get total num pages and all img urls
    const $ = cheerio.load(html);

    const pages = $('div[id^="page-"]');
    const data = pages.map((_i, e) => $(e).attr("style")).get();
    return {
      totalPages: pages.length,
      imgs: data.map((str) => str.match(/url\("(.*?)"/)?.[1]),
    };
  }

  async firstScrape() {
    const html = await this.#getHtml();
    return this.#scrapeHelper(html);
  }
}
