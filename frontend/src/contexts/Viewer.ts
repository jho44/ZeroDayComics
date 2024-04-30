import { createContext, useContext } from "react";

interface ViewerContextType {
  handleTextEdit: ({
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
