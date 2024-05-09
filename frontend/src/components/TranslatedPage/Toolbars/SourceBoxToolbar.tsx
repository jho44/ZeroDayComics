import { useState } from "react";
import Button from "./Button";

export default function SourceBoxToolbar({
  blockNum,
  pageNum,
  hoveringOnTarget,
  handleFontSizeChange,
}: {
  blockNum: number;
  pageNum: number;
  fontFam: string;
  hoveringOnTarget: boolean;
  handleFontSizeChange: (diff: number) => void;
}) {
  /* States */
  const [hovering, setHovering] = useState(false);

  /* Computed */
  const showToolbar = hoveringOnTarget || hovering;

  return (
    <div
      id={`toolbar-${pageNum}-${blockNum}`}
      className="absolute left-1/2 -translate-x-1/2 -top-[35px] flex gap-1 rounded-lg p-1 bg-zinc-100 text-black"
      style={{
        opacity: showToolbar ? 1 : 0,
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Button onClick={() => handleFontSizeChange(1)}>+</Button>
      <Button onClick={() => handleFontSizeChange(-1)}>-</Button>
      <div className="slidecontainer">
        <input type="range" min="1" max="100" value="100" className="slider" />
      </div>
    </div>
  );
}
