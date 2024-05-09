import "./App.css";
import LoadingBar from "./components/LoadingBar";
import SourceSelector from "./components/SourceSelector/SourceSelector";
import Viewer from "./components/Viewer";
import { SourceContext } from "./contexts/Source";
import { ViewerContext } from "./contexts/Viewer";
import usePipeline from "./lib/usePipeline";

function App() {
  /* Hooks */
  const {
    loading,
    pages,
    handleSubmitUI,
    handleResponse,
    handleTranslationChange,
    handleBoxDragResize,
    handleFontSizeChange,
    handleFontFamChange,
    handleSrcTextEdit,
  } = usePipeline();

  /* Computed */
  const numPagesDone = pages.filter(Boolean).length;

  if (!loading && !numPagesDone)
    return (
      <SourceContext.Provider
        value={{
          handleSubmitUI,
          handleResponse,
        }}
      >
        <SourceSelector />
      </SourceContext.Provider>
    );

  return (
    <div className="relative">
      <div className="loading-bar fixed w-screen left-0 bottom-0 p-4 flex flex-col gap-3 justify-center items-center">
        {loading && pages.length > 0 && (
          <LoadingBar numDone={numPagesDone} numToDo={pages.length} />
        )}
        {loading && !pages.length && <p>Retrieving pages...</p>}
      </div>

      <ViewerContext.Provider
        value={{
          handleTranslationChange,
          handleBoxDragResize,
          handleFontSizeChange,
          handleFontFamChange,
          handleSrcTextEdit,
        }}
      >
        <Viewer pages={pages} />
      </ViewerContext.Provider>
    </div>
  );
}

export default App;
