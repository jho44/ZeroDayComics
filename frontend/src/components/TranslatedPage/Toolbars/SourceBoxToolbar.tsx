import { useState } from "react";
import Button from "./Button";
import LoadingCircle from "../../LoadingCircle/LoadingCircle";

export default function SourceBoxToolbar({
  blockNum,
  pageNum,
  hoveringOnTarget,
  handleFontSizeChange,
  flipTranslSrc,
  handleOpacityChange,
  retranslate,
}: {
  blockNum: number;
  pageNum: number;
  hoveringOnTarget: boolean;
  handleFontSizeChange: (diff: number) => void;
  flipTranslSrc: () => void;
  handleOpacityChange: (val: any) => void;
  retranslate: () => Promise<void>;
}) {
  /* States */
  const [hovering, setHovering] = useState(false);
  const [translating, setTranslating] = useState(false);

  /* Computed */
  const showToolbar = hoveringOnTarget || hovering;

  /* Methods */
  const onClickTranslate = async () => {
    setTranslating(true);
    await retranslate();
    setTranslating(false);
  };

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
      <Button onClick={flipTranslSrc}>ABC</Button>
      <Button onClick={onClickTranslate} isActive={translating}>
        {translating ? <LoadingCircle size="1rem" thickness="2px" /> : "Transl"}
      </Button>
      <input
        type="range"
        min="1"
        max="100"
        defaultValue="100"
        className="slider"
        onChange={handleOpacityChange}
      />
    </div>
  );
}
