import { Fragment, useState } from "react";
import { OcrPage } from "../lib/definitions";
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

    return (
      <div
        className={`absolute w-1/6 top-0 h-full ${
          onLeftSide ? "" : "right-0"
        } border ${onLeftSide ? "border-purple-400" : "border-blue-400"}`}
        onClick={handleTurn}
      />
    );
  };

  const DisplayedPage = ({ pageNum }: { pageNum: number }) => {
    const scale = 0.8;
    const numPages = pages.length;
    const onLeftSide = !!(pageNum % 2);

    if (pageNum == numPages) return <div className="w-1/2 h-full" />;

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
        Loading
      </div>
    );
  };

  return (
    <div className="relative w-full">
      <div className="fixed top-0 w-screen flex items-center justify-center p-4 bg-purple-300">
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
