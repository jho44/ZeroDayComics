import { createContext, useContext } from "react";

interface ViewerContextType {
  handleTranslationChange: ({
    pageNum,
    blockNum,
    val,
  }: {
    pageNum: number;
    blockNum: number;
    val: string;
  }) => void;
  handleBoxDragResize: ({
    pageNum,
    blockNum,
    ...edits
  }: {
    pageNum: number;
    blockNum: number;
    transform: string;
    width: number;
    height: number;
  }) => void;
  handleFontSizeChange: ({
    pageNum,
    blockNum,
    newFontSize,
  }: {
    pageNum: number;
    blockNum: number;
    newFontSize: number;
  }) => void;
  handleFontFamChange: ({
    pageNum,
    blockNum,
    newFontFam,
  }: {
    pageNum: number;
    blockNum: number;
    newFontFam: string;
  }) => void;
  handleSrcTextEdit: ({
    pageNum,
    blockNum,
    lineNum,
    val,
  }: {
    pageNum: number;
    blockNum: number;
    lineNum: number;
    val: string;
  }) => void;
}

const ViewerContext = createContext<ViewerContextType | null>(null);

const useViewer = () => {
  const viewerContext = useContext(ViewerContext);

  if (!viewerContext) {
    throw new Error("useViewer has to be used within <ViewerContext.Provider>");
  }

  return viewerContext;
};

export { useViewer, ViewerContext };
export type { ViewerContextType };
