import { ReactNode, useEffect, useState } from "react";
import { ReactComponent as Check } from "../../icons/checkmark.svg";
import { fontFamilies } from "../../lib/definitions";

const PopperOption = ({
  content,
  onClick,
  chosen,
}: {
  content: string;
  onClick: (e: React.MouseEvent) => void;
  chosen: boolean;
}) => {
  return (
    <button
      className="flex items-center justify-between gap-2 grow rounded-md px-1.5 py-0.5 text-nowrap hover:bg-zinc-100 active:bg-zinc-200"
      onClick={onClick}
    >
      {content}
      {chosen ? <Check /> : <></>}
    </button>
  );
};

const FontFamilyPopper = ({
  open,
  fontFam,
  handleFontFamChange,
}: {
  open: boolean;
  fontFam: string;
  handleFontFamChange: (newFontFam: string) => void;
}) => {
  return (
    <div
      className="p-1 rounded-lg flex flex-col gap-1 border-[1px] bg-white border-zinc-200"
      style={{ display: open ? "flex" : "none" }}
    >
      {Object.values(fontFamilies).map(({ label, id }) => (
        <PopperOption
          onClick={() => handleFontFamChange(id)}
          key={id}
          content={label}
          chosen={id == fontFam}
        />
      ))}
    </div>
  );
};

const Button = ({
  children,
  onClick,
  isActive,
  popper,
}: {
  children: ReactNode;
  onClick: (e: React.MouseEvent) => void;
  isActive?: boolean;
  popper?: ReactNode;
}) => {
  return (
    <div className={`relative group ${isActive ? "is-active" : ""}`}>
      <button
        className="border-[1px] border-zinc-300 hover:bg-zinc-200 group-[.is-active]:bg-zinc-300 active:bg-zinc-300 rounded-md h-6 p-1.5 flex items-center justify-center text-nowrap"
        onClick={onClick}
      >
        {children}
      </button>
      {popper ? <div className="popper absolute">{popper}</div> : <></>}
    </div>
  );
};

export default function EditorToolbar({
  blockNum,
  pageNum,
  fontFam,
  hoveringOnTarget,
  handleFontSizeChange,
  handleFontFamChange,
  setPopperOpen,
}: {
  blockNum: number;
  pageNum: number;
  fontFam: string;
  hoveringOnTarget: boolean;
  handleFontSizeChange: (diff: number) => void;
  handleFontFamChange: (newFontFam: string) => void;
  setPopperOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  /* States */
  const [hovering, setHovering] = useState(false);
  const [fontFamPopperOpen, setFontFamPopperOpen] = useState(false);

  /* Computed */
  const showToolbar = hoveringOnTarget || hovering;

  /* Lifecycle Methods */
  useEffect(() => {
    setPopperOpen(fontFamPopperOpen);
  }, [fontFamPopperOpen]);

  useEffect(() => {
    // close all poppers
    if (!showToolbar) setFontFamPopperOpen(false);
  }, [showToolbar]);

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
      <Button
        onClick={() => setFontFamPopperOpen((_open) => !_open)}
        isActive={fontFamPopperOpen}
        popper={
          <FontFamilyPopper
            open={fontFamPopperOpen}
            fontFam={fontFam}
            handleFontFamChange={handleFontFamChange}
          />
        }
      >
        {fontFamilies[fontFam].label}
      </Button>
      <Button onClick={() => handleFontSizeChange(1)}>+</Button>
      <Button onClick={() => handleFontSizeChange(-1)}>-</Button>
    </div>
  );
}
