import { useRef, useState } from "react";
import "./App.css";
import SourceSelector from "./components/SourceSelector/SourceSelector";
import { OcrPage } from "./lib/definitions";
import Viewer from "./components/Viewer";

function App() {
  /* States */
  const [loadingMsg, setLoadingMsg] = useState<string>("");
  const [pages, setPages] = useState<OcrPage[]>([]);

  /* Refs */
  // const totalPages = useRef(0);

  /* Methods */
  const handleSubmit = () => {
    setLoadingMsg("Retrieving the chapter...");
  };

  const handleOcrStart = (_totalPages: number) => {
    // totalPages.current = _totalPages;
    setLoadingMsg(`Performing OCR and translating ${_totalPages} pages`);
    setPages(new Array(_totalPages).fill(null));
  };

  const handlePageDone = ({
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
    // setPages((_pages) => ({
    //   ..._pages,
    //   [pageNum]: JSON.parse(blks),
    // }));
  };

  const handleAllPagesDone = () => {
    setLoadingMsg("");
  };

  const numPagesDone = pages.filter(Boolean).length;
  if (!loadingMsg && !numPagesDone)
    return (
      <SourceSelector
        handleSubmitUI={handleSubmit}
        handleOcrStartUI={handleOcrStart}
        handlePageDoneUI={handlePageDone}
        handleAllPagesDoneUI={handleAllPagesDone}
      />
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
