import { Block } from "../../lib/definitions";

export default function SourceBox({
  img_width,
  box,
  font_size,
  vertical,
  boxNum,
  lines,
}: Block & { img_width: number; boxNum: number }) {
  const width = box[2] - box[0];

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        console.log("click handler");
      }}
      className="bg-white absolute border border-red-700 text-black pointer-events-auto overflow-hidden resize-none"
      style={{
        minWidth: `${width}px`,
        height: `${box[3] - box[1]}px`,
        right: `${img_width - box[0] - width}px`,
        top: `${box[1]}px`,
        fontSize: `${font_size}px`,
        zIndex: boxNum,
        writingMode: vertical ? ("vertical-rl" as const) : ("unset" as const),
      }}
    >
      {lines.map((line, j) => (
        <p key={j}>{line}</p>
      ))}
    </div>
  );
}
