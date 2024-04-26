import { useState } from "react";
import "./App.css";
import SourceSelector from "./components/SourceSelector/SourceSelector";
import Viewer from "./components/Viewer";
import { SourceContext } from "./contexts/Source";
import { OcrPage } from "./lib/definitions";

function App() {
  /* States */
  const [loading, setLoading] = useState<boolean>(false);
  const [pages, setPages] = useState<OcrPage[]>([]);

  /* Methods */
  const handleSubmitUI = () => {
    setLoading(true);
  };

  const handleOcrStartUI = (_totalPages: number) => {
    setLoading(true);
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
    setLoading(false);
  };

  const numPagesDone = pages.filter(Boolean).length;
  if (!loading && !numPagesDone)
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
    <div className="relative">
      {loading ? (
        <div className="loading-bar fixed w-screen left-0 bottom-0 p-4 flex flex-col gap-3 justify-center items-center">
          <div className="w-full max-w-[200px] h-3 bg-white rounded-sm overflow-hidden">
            <div
              className="bg-slate-400 h-full border-[3px] border-white"
              style={{ width: `${(numPagesDone / pages.length) * 100}%` }}
            />
          </div>
          <p>
            {numPagesDone} / {pages.length}
          </p>
        </div>
      ) : (
        <></>
      )}

      <Viewer pages={pages} />
    </div>
  );
}

export default App;
