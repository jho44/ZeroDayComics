import clsx from "clsx";
import TranslationPane from "./ui/TranslationPane";

export default function Home() {
  const leftPanePercent = 50;
  const rightPanePercent = 100 - leftPanePercent;
  return (
    <main className="flex h-screen">
      <div
        className="left-pane border border-sky-500"
        style={{ width: `${leftPanePercent}vw` }}
      >
        LEFT
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
