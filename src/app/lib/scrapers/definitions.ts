import { ComicSource, ComicSourceZ } from "../definitions";
import PixivScraper from "./PixivScraper";

export interface Scraper {
  scrape(pageNum: number): any;
}

export const scrapers: { [key in ComicSource]: new (url: string) => Scraper } =
  {
    [ComicSourceZ.enum.PIXIV]: PixivScraper,
  };
