import { createContext, Dispatch } from "react";
import { Action, defaultVal, SourceInfo } from "./definitions";

const ComicSourceContext = createContext<{
  sourceInfo: SourceInfo;
  setSourceInfo: Dispatch<Action>;
}>({ sourceInfo: defaultVal, setSourceInfo: () => {} });

export default ComicSourceContext;
