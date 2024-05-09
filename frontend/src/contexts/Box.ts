import { createContext, useContext } from "react";
import { Block } from "../lib/definitions";

interface BoxContextType {
  srcBlock: Block;
  translBlock: Block;
  pageNum: number;
  blockNum: number;
  imgWidth: number;
}

const BoxContext = createContext<BoxContextType | null>(null);

const useBox = () => {
  const boxContext = useContext(BoxContext);

  if (!boxContext) {
    throw new Error("useBox has to be used within <BoxContext.Provider>");
  }

  return boxContext;
};

export { useBox, BoxContext };
export type { BoxContextType };
