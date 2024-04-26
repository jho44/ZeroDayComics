import { useState } from "react";
import { OcrPage } from "../lib/definitions";
import LoadingCircle from "./LoadingCircle/LoadingCircle";
import TranslatedPage from "./TranslatedPage";

type Props = {
  pages: OcrPage[];
};

export default function Viewer({ pages }: Props) {
  /* Constants */
  const numPages = pages.length;

  /* States */
  const [currPage, setCurrPage] = useState(0);
  const [translated, setTranslated] = useState(true);

  /* Components */
  const Turner = ({ onLeftSide }: { onLeftSide: boolean }) => {
    const pageDiff = onLeftSide ? 2 : -2;

    const handleTurn = () => {
      setCurrPage((_currPage) => {
        const newPage = _currPage + pageDiff;
        if (newPage < 0 || newPage >= numPages) return _currPage;
        return newPage;
      });
    };

    let turnerStyle = onLeftSide ? "" : "right-0";

    if (onLeftSide && currPage + pageDiff < numPages)
      turnerStyle += " hover:bg-gradient-to-r";
    else if (!onLeftSide && currPage + pageDiff >= 0)
      turnerStyle += " hover:bg-gradient-to-l";

    return (
      <div
        className={`absolute w-1/4 top-0 h-full opacity-0 from-slate-100/20 to-transparent ease-in duration-150 transition-all hover:opacity-100 ${turnerStyle}`}
        onClick={handleTurn}
      />
    );
  };

  const DisplayedPage = ({ pageNum }: { pageNum: number }) => {
    const scale = 0.8;
    const numPages = pages.length;
    const onLeftSide = !!(pageNum % 2);

    if (numPages && pageNum == numPages)
      return <div className="w-1/2 h-full" />;

    if (pages[pageNum])
      return (
        <div
          className={`w-1/2 h-full flex items-center ${
            onLeftSide ? "justify-end" : ""
          }`}
        >
          <div
            className={`${onLeftSide ? "origin-right" : "origin-left"}`}
            style={{
              transform: `scale(${scale})`,
            }}
          >
            <TranslatedPage
              page={pages[pageNum]}
              pageNum={pageNum}
              translated={translated}
            />
          </div>
        </div>
      );

    return (
      <div className="w-1/2 h-full flex justify-center items-center">
        <LoadingCircle size="2rem" thickness="0.2rem" />
      </div>
    );
  };

  return (
    <div className="relative w-full">
      <div className="z-[1] fixed opacity-0 hover:opacity-100 transition-all duration-150 top-0 w-screen flex items-center justify-center p-5 rounded-b-md bg-[#353b45]">
        <button onClick={() => setTranslated((prev) => !prev)}>
          {translated ? "Translated" : "Original"}
        </button>
      </div>
      <Turner onLeftSide={true} />
      <div className="flex h-screen z-[1] relative pointer-events-none">
        <DisplayedPage pageNum={currPage + 1} />
        <DisplayedPage pageNum={currPage} />
      </div>
      <Turner onLeftSide={false} />
    </div>
  );
}
