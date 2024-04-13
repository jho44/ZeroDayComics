"use client";
import { useRef, useState } from "react";
import ComicPane from "@/app/ui/ComicPane";
import ComicSourcePane from "@/app/ui/ComicSourcePane/ComicSourcePane";
import LoadingCircle from "@/app/ui/icons/LoadingCircle";
import TranslationPane from "@/app/ui/TranslationPane";

export default function Home() {
  const [loadingComic, setLoadingComic] = useState(false);
  const comicUrl = useRef("");

  const leftPanePercent = 50;
  const rightPanePercent = 100 - leftPanePercent;

  const LeftPane = () => {
    if (loadingComic)
      return (
        <div>
          <LoadingCircle />
        </div>
      );

    if (comicUrl.current) return <ComicPane />;
    return <ComicSourcePane setLoadingComic={setLoadingComic} />;
  };
  return (
    <main className="flex h-screen">
      <div
        className="left-pane border border-sky-500"
        style={{ width: `${leftPanePercent}vw` }}
      >
        <LeftPane />
      </div>
      <div
        className="right-pane border border-purple-500"
        style={{ width: `${rightPanePercent}vw` }}
      >
        <TranslationPane />
      </div>
    </main>
  );
}
