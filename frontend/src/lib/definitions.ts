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

export type OcrPage = {
  img_width: number;
  img_height: number;
  blocks: {
    box: number[];
    vertical: boolean;
    font_size: number;
    lines_coords: number[][];
    lines: string[];
    translation: string;
  }[];
  sorted?: boolean;
  img: string;
};
