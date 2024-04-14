import { useContext, useEffect, useState } from "react";
import ComicSourceContext from "./contexts/ComicSource/context";

export default function ComicPane() {
  /* Contexts */
  const {
    sourceInfo: { imgs, totalPages },
  } = useContext(ComicSourceContext);

  /* States */
  const [displayedPage, setDisplayedPage] = useState(1); // can never go out of the range [0, totalPages-1]

  useEffect(() => {
    if (imgs.length === totalPages) return;

    // TODO: scrape next page
  }, [imgs.length, totalPages]);
  return (
    <div>
      <h1>Comic pane</h1>
      {/* <Image
        src={imgs[displayedPage]}
        alt={`Page ${displayedPage}`}
        width="0"
        height="0"
        className="w-full"
      /> */}
      <div></div>
    </div>
  );
}
