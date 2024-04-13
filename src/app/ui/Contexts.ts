import {
  createContext,
  createRef,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";

// const defaultSourceInfo = {
//   comicUrl: "",
//   latestRetrievedPageNum: 0,
//   totalPages: 0,
// };
type ComicSourceContextType = {
  comicUrl: string;
  setComicUrl: Dispatch<SetStateAction<string>>;
  latestRetrievedPage: number;
  setLatestRetrievedPage: Dispatch<SetStateAction<number>>;
};
export const ComicSourceContext = createContext<ComicSourceContextType>({
  comicUrl: "",
  setComicUrl: () => {},
  latestRetrievedPage: 0,
  setLatestRetrievedPage: () => {},
});
