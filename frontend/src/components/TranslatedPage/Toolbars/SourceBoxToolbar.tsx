import { useState } from "react";
import Button from "./Button";
import LoadingCircle from "../../LoadingCircle/LoadingCircle";
import { ReactComponent as Check } from "../../../icons/checkmark.svg";

export enum TranslationStatus {
  DEFAULT,
  IN_PROGRESS,
  DONE,
}

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
  const [translating, setTranslating] = useState<TranslationStatus>(
    TranslationStatus.DEFAULT
  );

  /* Computed */
  const showToolbar = hoveringOnTarget || hovering;
  const Translating = () => {
    if (translating === TranslationStatus.IN_PROGRESS)
      return <LoadingCircle size="1rem" thickness="2px" />;

    return <Check />;
  };

  /* Methods */
  const onClickTranslate = async () => {
    setTranslating(TranslationStatus.IN_PROGRESS);
    await retranslate();
    setTranslating(TranslationStatus.DONE);
    setTimeout(() => {
      setTranslating(TranslationStatus.DEFAULT);
    }, 2000);
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
      <Button
        onClick={onClickTranslate}
        isActive={translating !== TranslationStatus.DEFAULT}
      >
        {translating ? <Translating /> : "Transl"}
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
