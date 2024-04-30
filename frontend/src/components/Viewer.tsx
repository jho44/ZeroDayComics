import { useState } from "react";
import { OcrPage } from "../lib/definitions";
import LoadingCircle from "./LoadingCircle/LoadingCircle";
import Toolbar from "./Toolbar";
import TranslatedPage from "./TranslatedPage/TranslatedPage";

type Props = {
  pages: OcrPage[];
};

export default function Viewer({ pages }: Props) {
  /* States */
  const [currPage, setCurrPage] = useState(0);
  const [translated, setTranslated] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [numLoaded, setNumLoaded] = useState(0);

  /* Computed */
  const numPages = pages.length;

  /* Methods */
  const onLoadImg = () => {
    setNumLoaded((_prev) => _prev + 1);
  };

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

  const DisplayedPage = ({
    pageNum,
    visible = true,
  }: {
    pageNum: number;
    visible?: boolean;
  }) => {
    /* Constants */
    const scale = 0.8;

    /* Computed */
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
              onLoadImg={() => {
                if (!visible) onLoadImg();
              }}
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
      <Toolbar
        translated={translated}
        setTranslated={setTranslated}
        numPages={numPages}
        downloading={downloading}
        setDownloading={setDownloading}
        numLoaded={numLoaded}
      />
      <Turner onLeftSide={true} />
      <div className="flex h-screen z-[1] relative pointer-events-none">
        <DisplayedPage pageNum={currPage + 1} />
        <DisplayedPage pageNum={currPage} />
      </div>
      <Turner onLeftSide={false} />

      {downloading ? (
        <div className="absolute left-[100vw]">
          {Array(numPages)
            .fill(null)
            .map((_, pageNum) => (
              <DisplayedPage pageNum={pageNum} visible={false} key={pageNum} />
            ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
