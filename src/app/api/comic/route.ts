import { ComicSourceZ } from "@/app/lib/definitions";
import { scrapers } from "@/app/lib/scrapers/definitions";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const { searchParams } = url;
  const searchParamsSchema = z.object({
    which: ComicSourceZ,
    input: z.string(),
  });

  const { which: comicSrc, input } = searchParamsSchema.parse(
    Object.fromEntries(searchParams.entries())
  );

  const scraper = new scrapers[comicSrc](input);
  await scraper.scrape(0);

  return Response.json({ boop: true });
}
