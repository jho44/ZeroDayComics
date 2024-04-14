export type SourceInfo = {
  comicUrl: string;
  imgs: any[];
  totalPages: number;
};

export type Action = {
  type: "init";
  comicUrl: string;
  imgs: any[];
  totalPages: number;
};

export const defaultVal = {
  comicUrl: "",
  imgs: [],
  totalPages: 0,
};
