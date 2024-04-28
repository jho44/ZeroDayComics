import { createContext, useContext } from "react";

interface SourceContextType {
  handleSubmitUI: (payload?: { numPages: number }) => void;
  handleResponse: (res: Response) => Promise<void>;
}

const SourceContext = createContext<SourceContextType | null>(null);

const useSource = () => {
  const sourceContext = useContext(SourceContext);

  if (!sourceContext) {
    throw new Error("useSource has to be used within <SourceContext.Provider>");
  }

  return sourceContext;
};

export { useSource, SourceContext };
export type { SourceContextType };
