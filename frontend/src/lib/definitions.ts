export enum Source {
  PIXIV,
}

export const sources = [
  {
    label: "Pixiv Web Serial",
    id: Source.PIXIV,
    example: "https://comic.pixiv.net/viewer/stories/167987",
  },
];

export type Block = {
  font_family?: string;
  transform?: { transform: string; width: number; height: number };
  box: number[];
  vertical: boolean;
  font_size: number;
  lines: string[];
};

export type OcrPage = {
  img_width: number;
  img_height: number;
  transl_blocks: Block[];
  blocks: Block[];
  sorted?: boolean;
  img: string;
};

export const fontFamilies: {
  [key: string]: { id: string; label: string; value: string };
} = {
  "manga-temple": {
    id: "manga-temple",
    label: "Manga Temple",
    value: "Manga Temple",
  },
  "hey-comic": {
    id: "hey-comic",
    label: "Hey Comic",
    value: "Hey Comic",
  },
};
