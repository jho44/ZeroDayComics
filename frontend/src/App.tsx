import { useState } from "react";
import "./App.css";
import SourceSelector from "./components/SourceSelector/SourceSelector";
import Viewer from "./components/Viewer";
import { SourceContext } from "./contexts/Source";
import { OcrPage } from "./lib/definitions";

function App() {
  /* States */
  const [loadingMsg, setLoadingMsg] = useState<string>("");
  const [pages, setPages] = useState<OcrPage[]>([]);

  /* Methods */
  const handleSubmitUI = () => {
    setLoadingMsg("Retrieving the chapter...");
  };

  const handleOcrStartUI = (_totalPages: number) => {
    // totalPages.current = _totalPages;
    setLoadingMsg(`Performing OCR and translating ${_totalPages} pages`);
    setPages(new Array(_totalPages).fill(null));
  };

  const handlePageDoneUI = ({
    pageNum,
    blks,
  }: {
    pageNum: number;
    blks: string;
  }) => {
    setPages((_pages) => [
      ..._pages.slice(0, pageNum),
      JSON.parse(blks),
      ..._pages.slice(pageNum + 1),
    ]);
  };

  const handleAllPagesDoneUI = () => {
    setLoadingMsg("");
  };

  const numPagesDone = pages.filter(Boolean).length;
  if (!loadingMsg && !numPagesDone)
    return (
      <SourceContext.Provider
        value={{
          handleSubmitUI,
          handleOcrStartUI,
          handlePageDoneUI,
          handleAllPagesDoneUI,
        }}
      >
        <SourceSelector />
      </SourceContext.Provider>
    );

  return (
    <div>
      {loadingMsg ?? (
        <div>
          {loadingMsg}...{numPagesDone} / {pages.length}
        </div>
      )}

      <Viewer pages={pages} />
    </div>
  );
}

export default App;
