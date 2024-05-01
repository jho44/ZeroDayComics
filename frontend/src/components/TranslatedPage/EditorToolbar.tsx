import { ReactNode, useState } from "react";

function Button({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      className="border-[1px] border-zinc-300 hover:bg-zinc-200 active:bg-zinc-300 rounded-md w-5 h-5 flex items-center justify-center"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function EditorToolbar({
  hoveringOnTarget,
  handleFontSizeChange,
}: {
  hoveringOnTarget: boolean;
  handleFontSizeChange: (diff: number) => void;
  // pageNum: number;
  // blockNum: number;
}) {
  /* States */
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 -top-[35px] flex gap-1 rounded-lg p-1 bg-zinc-100 text-black"
      style={{
        visibility: hoveringOnTarget || hovering ? "visible" : "hidden",
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Button onClick={() => handleFontSizeChange(1)}>+</Button>
      <Button onClick={() => handleFontSizeChange(-1)}>-</Button>
    </div>
  );
}
