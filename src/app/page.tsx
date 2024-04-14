"use client";
import ComicPane from "@/app/ui/ComicPane";
import ComicSourcePane from "@/app/ui/ComicSourcePane/ComicSourcePane";
import LoadingCircle from "@/app/ui/icons/LoadingCircle";
import TranslationPane from "@/app/ui/TranslationPane";
import { useContext, useState } from "react";
import ComicSourceContext from "./ui/contexts/ComicSource/context";

export default function Home() {
  /* Constants */
  const leftPanePercent = 50;
  const rightPanePercent = 100 - leftPanePercent;

  /* Contexts */
  const {
    sourceInfo: { comicUrl },
  } = useContext(ComicSourceContext);

  /* States and Refs */
  const [loadingComic, setLoadingComic] = useState(false);

  /* Components */
  const LeftPane = () => {
    if (loadingComic)
      return (
        <div>
          <LoadingCircle />
        </div>
      );

    if (comicUrl) return <ComicPane />;
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
