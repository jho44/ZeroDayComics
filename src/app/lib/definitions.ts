import { z } from "zod";
export const ComicSourceZ = z.enum([
  "PIXIV",
  // , "KINDLE"
]);
export type ComicSource = z.infer<typeof ComicSourceZ>;
