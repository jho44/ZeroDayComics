import Scraper from "@/app/lib/scrapers/definitions";
import puppeteer from "puppeteer";

export default class PixivScraper implements Scraper {
  url: string;
  constructor(url: string) {
    this.url = url;
  }

  async scrape(pageNum: number) {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();

    await page.goto(this.url);

    return null;
  }
}
