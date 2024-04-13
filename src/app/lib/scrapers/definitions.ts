import { ComicSource, ComicSourceZ } from "@/app/lib/definitions";
import PixivScraper from "@/app/lib/scrapers/PixivScraper";

export interface Scraper {
  firstScrape(): Promise<{ totalPages: number; imgs: any[] }>;
}

interface PageScraper extends Scraper {
  subsequentScrape(pageNum: number): any;
}

export const scrapers: { [key in ComicSource]: new (url: string) => Scraper } =
  {
    [ComicSourceZ.enum.PIXIV]: PixivScraper,
  };
